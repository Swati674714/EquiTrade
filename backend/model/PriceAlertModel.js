const mongoose = require("mongoose");
const { PriceAlertSchema } = require("../schemas/PriceAlertSchema");

const PriceAlertModel = mongoose.model("pricealert", PriceAlertSchema);

module.exports = { PriceAlertModel };
