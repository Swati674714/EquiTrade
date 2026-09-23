import React, { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";

function buildCandles(lastPrice) {
  const candles = [];
  let price = lastPrice || 100;
  const now = Math.floor(Date.now() / 1000);
  for (let i = 40; i >= 0; i -= 1) {
    const open = price;
    const change = (Math.random() - 0.5) * price * 0.012;
    const close = Math.max(1, open + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.004);
    const low = Math.min(open, close) * (1 - Math.random() * 0.004);
    candles.push({
      time: now - i * 300,
      open,
      high,
      low,
      close,
    });
    price = close;
  }
  return candles;
}

export default function CandleChart({ symbol, lastPrice }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const chart = createChart(ref.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#12161f" },
        textColor: "#9aa4b2",
      },
      grid: {
        vertLines: { color: "#1e2430" },
        horzLines: { color: "#1e2430" },
      },
      width: ref.current.clientWidth,
      height: 280,
    });
    const series = chart.addSeries(CandlestickSeries, {
          upColor: "#00d09c",
          downColor: "#ff4d4f",
          borderVisible: false,
          wickUpColor: "#00d09c",
          wickDownColor: "#ff4d4f",
        });
    series.setData(buildCandles(lastPrice));
    chart.timeScale().fitContent();
    const onResize = () => chart.applyOptions({ width: ref.current.clientWidth });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
    };
  }, [symbol, lastPrice]);

  return (
    <div>
      <p className="muted">Simulated OHLC for {symbol} (not exchange data)</p>
      <div ref={ref} />
    </div>
  );
}
