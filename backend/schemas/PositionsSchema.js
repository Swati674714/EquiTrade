const { Schema } = require("mongoose");

const PositionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    product: { type: String, default: "CNC" },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
    avg: { type: Number, required: true },
    price: { type: Number, required: true },
    net: { type: String, default: "0.00%" },
    day: { type: String, default: "0.00%" },
    isLoss: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PositionsSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = { PositionsSchema };
