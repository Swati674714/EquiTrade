const { Schema } = require("mongoose");

const PriceAlertSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    symbol: { type: String, required: true },
    targetPrice: { type: Number, required: true },
    direction: { type: String, enum: ["above", "below"], required: true },
    triggered: { type: Boolean, default: false },
    triggeredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = { PriceAlertSchema };
