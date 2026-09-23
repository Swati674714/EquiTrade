const mongoose = require("mongoose");
const { UserModel } = require("../model/UserModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");
const { TransactionModel } = require("../model/TransactionModel");
const { StockModel } = require("../model/StockModel");
const { buyDebit, sellCredit, round2 } = require("./charges");

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function availableBalance(user) {
  return round2((user.walletBalance || 0) - (user.reservedBalance || 0));
}

function pnlFields(qty, avg, lastPrice) {
  const invested = qty * avg;
  const current = qty * lastPrice;
  const pnl = current - invested;
  const net = invested === 0 ? "0.00%" : `${pnl >= 0 ? "+" : ""}${((pnl / invested) * 100).toFixed(2)}%`;
  const dayChange = avg === 0 ? 0 : ((lastPrice - avg) / avg) * 100;
  return {
    price: lastPrice,
    net,
    day: `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`,
    isLoss: pnl < 0,
  };
}

function withSession(query, session) {
  return session ? query.session(session) : query;
}

function writeOpts(session) {
  return session ? { session, ordered: true } : {};
}

async function upsertHoldingAndPosition(userId, symbol, qtyDelta, tradePrice, session) {
  const holding = await withSession(HoldingsModel.findOne({ userId, name: symbol }), session);
  const lastPrice = tradePrice;

  if (!holding) {
    if (qtyDelta <= 0) {
      throw httpError(400, "You do not have enough quantity to sell");
    }
    const fields = pnlFields(qtyDelta, tradePrice, lastPrice);
    await HoldingsModel.create([{ userId, name: symbol, qty: qtyDelta, avg: tradePrice, ...fields }], writeOpts(session));
    await PositionsModel.create(
      [{ userId, product: "CNC", name: symbol, qty: qtyDelta, avg: tradePrice, ...fields }],
      writeOpts(session)
    );
    return;
  }

  const nextQty = holding.qty + qtyDelta;
  if (nextQty < -0.0001) {
    throw httpError(400, "You do not have enough quantity to sell");
  }

  if (nextQty <= 0) {
    await withSession(HoldingsModel.deleteOne({ _id: holding._id }), session);
    await withSession(PositionsModel.deleteOne({ userId, name: symbol }), session);
    return;
  }

  let nextAvg = holding.avg;
  if (qtyDelta > 0) {
    nextAvg = (holding.avg * holding.qty + tradePrice * qtyDelta) / nextQty;
  }

  const fields = pnlFields(nextQty, nextAvg, lastPrice);
  holding.qty = nextQty;
  holding.avg = round2(nextAvg);
  Object.assign(holding, fields);
  await holding.save(writeOpts(session));

  await PositionsModel.findOneAndUpdate(
    { userId, name: symbol },
    {
      userId,
      product: "CNC",
      name: symbol,
      qty: nextQty,
      avg: round2(nextAvg),
      ...fields,
    },
    { upsert: true, new: true, ...(writeOpts(session)) }
  );
}

async function executeFill(user, order, fillPrice, session) {
  const qty = order.qty;
  const mode = order.mode;

  if (mode === "BUY") {
    const summary = buyDebit(qty, fillPrice);
    if (availableBalance(user) + (order.reservedAmount || 0) + 0.001 < summary.netAmount) {
      throw httpError(400, "Insufficient funds");
    }

    if (order.reservedAmount) {
      user.reservedBalance = round2(Math.max(0, user.reservedBalance - order.reservedAmount));
    }
    user.walletBalance = round2(user.walletBalance - summary.netAmount);
    await user.save(writeOpts(session));

    await upsertHoldingAndPosition(user._id, order.name, qty, fillPrice, session);

    await TransactionModel.create(
      [
        {
          userId: user._id,
          type: "TRADE_BUY",
          amount: -summary.turnover,
          balanceAfter: user.walletBalance,
          meta: { symbol: order.name, qty, price: fillPrice, orderId: order._id },
        },
        {
          userId: user._id,
          type: "CHARGES",
          amount: -summary.total,
          balanceAfter: user.walletBalance,
          meta: { symbol: order.name, orderId: order._id, charges: summary },
        },
      ],
      writeOpts(session)
    );

    order.status = "EXECUTED";
    order.executedPrice = fillPrice;
    order.charges = {
      brokerage: summary.brokerage,
      stt: summary.stt,
      gst: summary.gst,
      total: summary.total,
    };
    order.turnover = summary.turnover;
    order.netAmount = summary.netAmount;
    order.reservedAmount = 0;
    await order.save(writeOpts(session));
    return { order, summary, walletBalance: user.walletBalance };
  }

  const holding = await withSession(HoldingsModel.findOne({ userId: user._id, name: order.name }), session);
  if (!holding || holding.qty < qty) {
    throw httpError(400, "You do not have enough quantity to sell");
  }

  const summary = sellCredit(qty, fillPrice);
  user.walletBalance = round2(user.walletBalance + summary.netAmount);
  await user.save(writeOpts(session));
  await upsertHoldingAndPosition(user._id, order.name, -qty, fillPrice, session);

  await TransactionModel.create(
    [
      {
        userId: user._id,
        type: "TRADE_SELL",
        amount: summary.turnover,
        balanceAfter: user.walletBalance,
        meta: { symbol: order.name, qty, price: fillPrice, orderId: order._id },
      },
      {
        userId: user._id,
        type: "CHARGES",
        amount: -summary.total,
        balanceAfter: user.walletBalance,
        meta: { symbol: order.name, orderId: order._id, charges: summary },
      },
    ],
    writeOpts(session)
  );

  order.status = "EXECUTED";
  order.executedPrice = fillPrice;
  order.charges = {
    brokerage: summary.brokerage,
    stt: summary.stt,
    gst: summary.gst,
    total: summary.total,
  };
  order.turnover = summary.turnover;
  order.netAmount = summary.netAmount;
  await order.save(writeOpts(session));
  return { order, summary, walletBalance: user.walletBalance };
}

async function withTransaction(work) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
  } catch {
    session.endSession();
    return work(null);
  }

  try {
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (_) {
      /* standalone MongoDB has no transactions */
    }
    if (String(err.message || "").toLowerCase().includes("transaction")) {
      session.endSession();
      return work(null);
    }
    throw err;
  } finally {
    session.endSession();
  }
}

async function placeOrder({ userId, name, qty, price, mode, orderType }) {
  const stock = await StockModel.findOne({ symbol: name });
  if (!stock) {
    throw httpError(404, "Unknown symbol");
  }

  const marketPrice = stock.lastPrice;
  const isMarket = orderType === "MARKET";
  const limitPrice = isMarket ? marketPrice : price;
  const fillNow =
    isMarket ||
    (mode === "BUY" && marketPrice <= limitPrice) ||
    (mode === "SELL" && marketPrice >= limitPrice);

  return withTransaction(async (session) => {
    const user = await withSession(UserModel.findById(userId), session);
    if (!user) {
      throw httpError(404, "User not found");
    }

    if (mode === "SELL") {
      const holding = await withSession(HoldingsModel.findOne({ userId, name }), session);
      if (!holding || holding.qty < qty) {
        throw httpError(400, "You do not have enough quantity to sell");
      }
    }

    const preview = mode === "BUY" ? buyDebit(qty, fillNow ? marketPrice : limitPrice) : sellCredit(qty, fillNow ? marketPrice : limitPrice);

    if (fillNow) {
      const order = (
        await OrdersModel.create(
          [
            {
              userId,
              name,
              qty,
              price: isMarket ? marketPrice : limitPrice,
              mode,
              orderType,
              status: "PENDING",
            },
          ],
          writeOpts(session)
        )
      )[0];
      return executeFill(user, order, marketPrice, session);
    }

    let reservedAmount = 0;
    if (mode === "BUY") {
      reservedAmount = preview.netAmount;
      if (availableBalance(user) + 0.001 < reservedAmount) {
        throw httpError(400, "Insufficient funds");
      }
      user.reservedBalance = round2(user.reservedBalance + reservedAmount);
      await user.save(writeOpts(session));
    }

    const order = (
      await OrdersModel.create(
        [
          {
            userId,
            name,
            qty,
            price: limitPrice,
            mode,
            orderType,
            status: "PENDING",
            reservedAmount,
            charges: {
              brokerage: preview.brokerage,
              stt: preview.stt,
              gst: preview.gst,
              total: preview.total,
            },
            turnover: preview.turnover,
            netAmount: preview.netAmount,
          },
        ],
        writeOpts(session)
      )
    )[0];

    return {
      order,
      summary: preview,
      walletBalance: user.walletBalance,
      reservedBalance: user.reservedBalance,
    };
  });
}

async function cancelOrder({ userId, orderId }) {
  return withTransaction(async (session) => {
    const order = await withSession(OrdersModel.findOne({ _id: orderId, userId }), session);
    if (!order) {
      throw httpError(404, "Order not found");
    }
    if (order.status !== "PENDING") {
      throw httpError(400, "Only pending orders can be cancelled");
    }

    const user = await withSession(UserModel.findById(userId), session);
    if (order.reservedAmount) {
      user.reservedBalance = round2(Math.max(0, user.reservedBalance - order.reservedAmount));
      await user.save(writeOpts(session));
    }

    order.status = "CANCELLED";
    order.reservedAmount = 0;
    await order.save(writeOpts(session));
    return order;
  });
}

async function fillPendingLimits(symbol, lastPrice) {
  const pending = await OrdersModel.find({
    name: symbol,
    status: "PENDING",
    orderType: "LIMIT",
  });

  for (const order of pending) {
    const shouldFill =
      (order.mode === "BUY" && lastPrice <= order.price) ||
      (order.mode === "SELL" && lastPrice >= order.price);
    if (!shouldFill) continue;

    try {
      await withTransaction(async (session) => {
        const fresh = await withSession(OrdersModel.findById(order._id), session);
        if (!fresh || fresh.status !== "PENDING") return;
        const user = await withSession(UserModel.findById(fresh.userId), session);
        if (!user) return;
        await executeFill(user, fresh, lastPrice, session);
      });
    } catch (err) {
      console.error("Limit fill failed", order._id.toString(), err.message);
    }
  }
}

module.exports = {
  placeOrder,
  cancelOrder,
  fillPendingLimits,
  availableBalance,
  pnlFields,
  httpError,
};
