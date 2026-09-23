const mongoose = require("mongoose");
const { StockSchema } = require("../schemas/StockSchema");

const StockModel = mongoose.model("stock", StockSchema);

module.exports = { StockModel };
