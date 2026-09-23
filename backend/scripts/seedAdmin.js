require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDb } = require("../config/db");
const { UserModel } = require("../model/UserModel");

async function seedAdmin() {
  await connectDb();
  const email = (process.env.ADMIN_EMAIL || "admin@equitrade.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const existing = await UserModel.findOne({ email });
  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log("Existing user promoted to admin:", email);
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  await UserModel.create({
    name: "EquiTrade Admin",
    email,
    password: hash,
    role: "admin",
    kycStatus: "approved",
    walletBalance: 0,
  });
  console.log("Admin created:", email);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
