const mongoose = require("mongoose");
const { mongoUrl } = require("./env");

async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUrl);
  console.log("MongoDB connected");
}

module.exports = { connectDb };
