const express = require("express");
const { PositionsModel } = require("../model/PositionsModel");
const { StockModel } = require("../model/StockModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { pnlFields } = require("../services/tradingEngine");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const positions = await PositionsModel.find({ userId: req.user._id }).lean();
    const symbols = positions.map((p) => p.name);
    const stocks = await StockModel.find({ symbol: { $in: symbols } }).lean();
    const priceMap = Object.fromEntries(stocks.map((s) => [s.symbol, s.lastPrice]));

    const live = positions.map((p) => {
      const last = priceMap[p.name] ?? p.price;
      return { ...p, ...pnlFields(p.qty, p.avg, last) };
    });

    res.json(live);
  })
);

module.exports = router;
