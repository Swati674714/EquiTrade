const express = require("express");
const { body } = require("express-validator");
const { UserModel } = require("../model/UserModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { TransactionModel } = require("../model/TransactionModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { availableBalance } = require("../services/tradingEngine");
const { round2 } = require("../services/charges");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id);
    const holdings = await HoldingsModel.find({ userId: user._id });
    const usedMargin = round2(holdings.reduce((sum, h) => sum + h.qty * h.avg, 0));
    const available = availableBalance(user);

    res.json({
      walletBalance: user.walletBalance,
      reservedBalance: user.reservedBalance,
      availableMargin: available,
      usedMargin,
      availableCash: available,
    });
  })
);

router.get(
  "/transactions",
  auth,
  asyncHandler(async (req, res) => {
    const rows = await TransactionModel.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);
    res.json(rows);
  })
);

router.post(
  "/add",
  auth,
  [body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least 1")],
  validate,
  asyncHandler(async (req, res) => {
    const amount = round2(Number(req.body.amount));
    const user = await UserModel.findById(req.user._id);
    user.walletBalance = round2(user.walletBalance + amount);
    await user.save();
    await TransactionModel.create({
      userId: user._id,
      type: "ADD_FUNDS",
      amount,
      balanceAfter: user.walletBalance,
      meta: { note: "Simulated add money" },
    });
    res.json({ walletBalance: user.walletBalance, reservedBalance: user.reservedBalance });
  })
);

router.post(
  "/withdraw",
  auth,
  [body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least 1")],
  validate,
  asyncHandler(async (req, res) => {
    const amount = round2(Number(req.body.amount));
    const user = await UserModel.findById(req.user._id);
    if (availableBalance(user) + 0.001 < amount) {
      return res.status(400).json({ message: "Insufficient available balance" });
    }
    user.walletBalance = round2(user.walletBalance - amount);
    await user.save();
    await TransactionModel.create({
      userId: user._id,
      type: "WITHDRAW",
      amount: -amount,
      balanceAfter: user.walletBalance,
      meta: { note: "Simulated withdraw" },
    });
    res.json({ walletBalance: user.walletBalance, reservedBalance: user.reservedBalance });
  })
);

module.exports = router;
