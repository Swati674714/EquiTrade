const mongoose = require("mongoose");
const { TransactionSchema } = require("../schemas/TransactionSchema");

const TransactionModel = mongoose.model("transaction", TransactionSchema);

module.exports = { TransactionModel };
