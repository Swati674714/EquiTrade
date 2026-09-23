function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function calculateCharges(mode, qty, price) {
  const turnover = round2(qty * price);
  const brokerage = round2(Math.min(20, turnover * 0.0003));
  const stt = mode === "SELL" ? round2(turnover * 0.001) : 0;
  const gst = round2(brokerage * 0.18);
  const total = round2(brokerage + stt + gst);

  return { turnover, brokerage, stt, gst, total };
}

function buyDebit(qty, price) {
  const charges = calculateCharges("BUY", qty, price);
  return {
    ...charges,
    netAmount: round2(charges.turnover + charges.total),
  };
}

function sellCredit(qty, price) {
  const charges = calculateCharges("SELL", qty, price);
  return {
    ...charges,
    netAmount: round2(charges.turnover - charges.total),
  };
}

module.exports = { round2, calculateCharges, buyDebit, sellCredit };
