const { Schema } = require("mongoose");

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    type: {
      type: String,
      enum: ["ADD_FUNDS", "WITHDRAW", "TRADE_BUY", "TRADE_SELL", "CHARGES"],
      required: true,
    },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = { TransactionSchema };
