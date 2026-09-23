const { StockModel } = require("../model/StockModel");
const { marketDataProvider, alphaVantageApiKey } = require("../config/env");

const simulated = {
  async getQuote(symbol) {
    const stock = await StockModel.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      const err = new Error("Unknown symbol");
      err.statusCode = 404;
      throw err;
    }
    return {
      symbol: stock.symbol,
      name: stock.name,
      lastPrice: stock.lastPrice,
      changePercent: stock.changePercent,
      provider: "simulated",
    };
  },
};

const alphavantage = {
  async getQuote(symbol) {
    if (!alphaVantageApiKey) {
      const err = new Error("Alpha Vantage is not configured. Set ALPHA_VANTAGE_API_KEY.");
      err.statusCode = 501;
      throw err;
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${alphaVantageApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const quote = data["Global Quote"] || {};
    const lastPrice = Number(quote["05. price"]);
    if (!lastPrice) {
      const err = new Error("Alpha Vantage returned no quote (rate limit or invalid symbol)");
      err.statusCode = 502;
      throw err;
    }
    return {
      symbol: quote["01. symbol"] || symbol,
      lastPrice,
      changePercent: Number(String(quote["10. change percent"] || "0").replace("%", "")),
      provider: "alphavantage",
    };
  },
};

const providers = { simulated, alphavantage };

function getMarketProvider() {
  return providers[marketDataProvider] || simulated;
}

module.exports = { getMarketProvider, providers };
