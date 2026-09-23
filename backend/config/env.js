require("dotenv").config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  port: Number(process.env.PORT) || 3002,
  mongoUrl: required("MONGO_URL"),
  jwtSecret: required("JWT_SECRET", "dev-only-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigins,
  marketDataProvider: process.env.MARKET_DATA_PROVIDER || "simulated",
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || "",
  priceTickMs: Number(process.env.PRICE_TICK_MS) || 3000,
};
