const { PriceAlertModel } = require("../model/PriceAlertModel");

async function checkPriceAlerts(symbol, lastPrice) {
  const open = await PriceAlertModel.find({ symbol, triggered: false });
  const fired = [];

  for (const alert of open) {
    const crossed =
      (alert.direction === "above" && lastPrice >= alert.targetPrice) ||
      (alert.direction === "below" && lastPrice <= alert.targetPrice);
    if (!crossed) continue;
    alert.triggered = true;
    alert.triggeredAt = new Date();
    await alert.save();
    fired.push(alert);
  }

  return fired;
}

module.exports = { checkPriceAlerts };
