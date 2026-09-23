const { Schema } = require("mongoose");

const StockSchema = new Schema(
  {
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastPrice: { type: Number, required: true },
    prevClose: { type: Number, required: true },
    changePercent: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = { StockSchema };
