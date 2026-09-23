const express = require("express");
const { body, param } = require("express-validator");
const { OrdersModel } = require("../model/OrdersModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { orderLimiter } = require("../middleware/rateLimits");
const { placeOrder, cancelOrder } = require("../services/tradingEngine");
const { buyDebit, sellCredit } = require("../services/charges");
const { StockModel } = require("../model/StockModel");

const router = express.Router();

const orderValidators = [
  body("name").trim().notEmpty().withMessage("Symbol is required"),
  body("qty").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("price").optional().isFloat({ min: 0 }),
  body("mode").isIn(["BUY", "SELL"]).withMessage("Mode must be BUY or SELL"),
  body("orderType").optional().isIn(["MARKET", "LIMIT"]),
];

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const orders = await OrdersModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  })
);

router.post(
  "/",
  auth,
  orderLimiter,
  orderValidators,
  validate,
  asyncHandler(async (req, res) => {
    const result = await placeOrder({
      userId: req.user._id,
      name: String(req.body.name).toUpperCase(),
      qty: Number(req.body.qty),
      price: Number(req.body.price || 0),
      mode: req.body.mode,
      orderType: req.body.orderType || "MARKET",
    });
    res.status(201).json(result);
  })
);

router.post(
  "/preview",
  auth,
  orderValidators,
  validate,
  asyncHandler(async (req, res) => {
    const symbol = String(req.body.name).toUpperCase();
    const stock = await StockModel.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ message: "Unknown symbol" });
    }
    const orderType = req.body.orderType || "MARKET";
    const price = orderType === "MARKET" ? stock.lastPrice : Number(req.body.price);
    const summary =
      req.body.mode === "BUY" ? buyDebit(Number(req.body.qty), price) : sellCredit(Number(req.body.qty), price);
    res.json({ lastPrice: stock.lastPrice, price, ...summary });
  })
);

router.post(
  "/:id/cancel",
  auth,
  orderLimiter,
  [param("id").isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const order = await cancelOrder({ userId: req.user._id, orderId: req.params.id });
    res.json({ order });
  })
);

module.exports = router;
