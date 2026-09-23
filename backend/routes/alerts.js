const express = require("express");
const { body } = require("express-validator");
const { PriceAlertModel } = require("../model/PriceAlertModel");
const { StockModel } = require("../model/StockModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const alerts = await PriceAlertModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(alerts);
  })
);

router.post(
  "/",
  auth,
  [
    body("symbol").trim().notEmpty(),
    body("targetPrice").isFloat({ min: 0.01 }),
    body("direction").isIn(["above", "below"]),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const symbol = String(req.body.symbol).toUpperCase();
    const stock = await StockModel.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ message: "Unknown symbol" });
    }
    const alert = await PriceAlertModel.create({
      userId: req.user._id,
      symbol,
      targetPrice: Number(req.body.targetPrice),
      direction: req.body.direction,
    });
    res.status(201).json(alert);
  })
);

module.exports = router;
