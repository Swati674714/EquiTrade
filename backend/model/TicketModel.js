const mongoose = require("mongoose");
const { TicketSchema } = require("../schemas/TicketSchema");

const TicketModel = mongoose.model("ticket", TicketSchema);

module.exports = { TicketModel };
