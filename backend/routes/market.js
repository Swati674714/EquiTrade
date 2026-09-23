const express = require("express");
const { StockModel } = require("../model/StockModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { getMarketProvider } = require("../services/marketProvider");

const router = express.Router();

router.get(
  "/watchlist",
  auth,
  asyncHandler(async (req, res) => {
    const stocks = await StockModel.find({}).sort({ symbol: 1 });
    res.json(
      stocks.map((s) => ({
        symbol: s.symbol,
        name: s.name,
        lastPrice: s.lastPrice,
        changePercent: s.changePercent,
        high: s.high,
        low: s.low,
        isDown: s.changePercent < 0,
      }))
    );
  })
);

router.get(
  "/quote/:symbol",
  auth,
  asyncHandler(async (req, res) => {
    const quote = await getMarketProvider().getQuote(req.params.symbol.toUpperCase());
    res.json(quote);
  })
);

module.exports = router;
