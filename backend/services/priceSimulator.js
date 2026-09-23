const { StockModel } = require("../model/StockModel");
const { fillPendingLimits } = require("./tradingEngine");
const { checkPriceAlerts } = require("./alertChecker");
const { priceTickMs } = require("../config/env");
const { round2 } = require("./charges");

const DEFAULT_STOCKS = [
  { symbol: "INFY", name: "Infosys", lastPrice: 1555.45 },
  { symbol: "ONGC", name: "ONGC", lastPrice: 116.8 },
  { symbol: "TCS", name: "Tata Consultancy Services", lastPrice: 3194.8 },
  { symbol: "KPITTECH", name: "KPIT Technologies", lastPrice: 266.45 },
  { symbol: "QUICKHEAL", name: "Quick Heal", lastPrice: 308.55 },
  { symbol: "WIPRO", name: "Wipro", lastPrice: 577.75 },
  { symbol: "M&M", name: "Mahindra & Mahindra", lastPrice: 779.8 },
  { symbol: "RELIANCE", name: "Reliance Industries", lastPrice: 2112.4 },
  { symbol: "HUL", name: "Hindustan Unilever", lastPrice: 512.4 },
  { symbol: "HDFCBANK", name: "HDFC Bank", lastPrice: 1522.35 },
  { symbol: "SBIN", name: "State Bank of India", lastPrice: 430.2 },
  { symbol: "ITC", name: "ITC", lastPrice: 207.9 },
  { symbol: "TATAPOWER", name: "Tata Power", lastPrice: 124.15 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", lastPrice: 541.15 },
];

async function seedStocks() {
  for (const item of DEFAULT_STOCKS) {
    await StockModel.updateOne(
      { symbol: item.symbol },
      {
        $setOnInsert: {
          symbol: item.symbol,
          name: item.name,
          lastPrice: item.lastPrice,
          prevClose: item.lastPrice,
          changePercent: 0,
          high: item.lastPrice,
          low: item.lastPrice,
        },
      },
      { upsert: true }
    );
  }
}

function randomWalk(price) {
  const change = (Math.random() * 0.008 - 0.004) * price;
  return Math.max(1, round2(price + change));
}

async function tickOnce(io) {
  const stocks = await StockModel.find({});
  const payload = [];

  for (const stock of stocks) {
    const next = randomWalk(stock.lastPrice);
    const changePercent = round2(((next - stock.prevClose) / stock.prevClose) * 100);
    stock.lastPrice = next;
    stock.changePercent = changePercent;
    stock.high = Math.max(stock.high || next, next);
    stock.low = Math.min(stock.low || next, next);
    await stock.save();
    payload.push({
      symbol: stock.symbol,
      name: stock.name,
      lastPrice: stock.lastPrice,
      changePercent: stock.changePercent,
      high: stock.high,
      low: stock.low,
      isDown: changePercent < 0,
    });

    await fillPendingLimits(stock.symbol, next);
    const fired = await checkPriceAlerts(stock.symbol, next);
    if (io && fired.length) {
      fired.forEach((alert) => {
        io.to(`user:${alert.userId}`).emit("alert", {
          symbol: alert.symbol,
          targetPrice: alert.targetPrice,
          lastPrice: next,
          direction: alert.direction,
        });
      });
    }
  }

  if (io) {
    io.emit("prices", payload);
  }
  return payload;
}

function startPriceSimulator(io) {
  seedStocks().catch((err) => console.error("Stock seed failed", err));
  const timer = setInterval(() => {
    tickOnce(io).catch((err) => console.error("Price tick failed", err));
  }, priceTickMs);
  if (timer.unref) timer.unref();
  return timer;
}

module.exports = { startPriceSimulator, seedStocks, tickOnce, DEFAULT_STOCKS };
