const { Schema } = require("mongoose");

const TicketSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = { TicketSchema };
