const { Schema } = require("mongoose");

const ChargesSchema = new Schema(
  {
    brokerage: { type: Number, default: 0 },
    stt: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const OrdersSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    executedPrice: { type: Number, default: null },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    orderType: { type: String, enum: ["MARKET", "LIMIT"], default: "MARKET" },
    status: {
      type: String,
      enum: ["PENDING", "EXECUTED", "CANCELLED"],
      default: "PENDING",
    },
    charges: { type: ChargesSchema, default: () => ({}) },
    reservedAmount: { type: Number, default: 0 },
    turnover: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = { OrdersSchema };
