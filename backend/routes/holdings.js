const express = require("express");
const { HoldingsModel } = require("../model/HoldingsModel");
const { StockModel } = require("../model/StockModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { pnlFields } = require("../services/tradingEngine");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const holdings = await HoldingsModel.find({ userId: req.user._id }).lean();
    const symbols = holdings.map((h) => h.name);
    const stocks = await StockModel.find({ symbol: { $in: symbols } }).lean();
    const priceMap = Object.fromEntries(stocks.map((s) => [s.symbol, s.lastPrice]));

    const live = holdings.map((h) => {
      const last = priceMap[h.name] ?? h.price;
      return { ...h, ...pnlFields(h.qty, h.avg, last) };
    });

    res.json(live);
  })
);

module.exports = router;
