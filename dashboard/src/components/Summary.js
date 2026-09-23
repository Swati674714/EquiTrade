import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePrices } from "../context/SocketContext";
import api from "../api/axios";
import { DoughnutChart } from "./DoughnoutChart";
import "./Summary.css";

const Summary = () => {
  const { user } = useAuth();
  const { prices, connected } = usePrices();
  const [funds, setFunds] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/api/funds"), api.get("/api/holdings"), api.get("/api/market/watchlist")])
      .then(([f, h, w]) => {
        setFunds(f.data);
        setHoldings(h.data || []);
        setWatchlist(w.data || []);
      })
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    let invested = 0;
    let current = 0;
    holdings.forEach((h) => {
      const last = prices[h.name]?.lastPrice ?? h.price;
      invested += h.qty * h.avg;
      current += h.qty * last;
    });
    return { invested, current, pnl: current - invested, count: holdings.length };
  }, [holdings, prices]);

  const marketData = useMemo(() => {
    return watchlist.map((row) => {
      const live = prices[row.symbol];
      return {
        symbol: row.symbol,
        price: live ? live.lastPrice : row.lastPrice,
        changePercent: live ? live.changePercent : row.changePercent,
      };
    });
  }, [watchlist, prices]);

  const chartData = {
    labels: marketData.map((s) => s.symbol),
    datasets: [
      {
        label: "Price",
        data: marketData.map((s) => s.price),
        backgroundColor: [
          "#10b98166", "#0066cc66", "#ef444466", "#f59e0b66",
          "#8b5cf666", "#06b6d466", "#ec489966", "#84cc1666",
          "#f9731666", "#6366f166", "#14b8a666", "#a855f766",
          "#eab30866", "#22c55e66",
        ],
        borderColor: [
          "#10b981", "#0066cc", "#ef4444", "#f59e0b",
          "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16",
          "#f97316", "#6366f1", "#14b8a6", "#a855f7",
          "#eab308", "#22c55e",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <div className="username">
        <h6>Hi, {user?.name || "trader"}</h6>
        <p className="muted">{connected ? "Live prices connected" : "Connecting to market..."} · KYC {user?.kycStatus}</p>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>
        <div className="data">
          <div className="first">
            <h3>{(funds?.availableMargin || 0).toFixed(2)}</h3>
            <p>Margin available</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Margins used <span>{(funds?.usedMargin || 0).toFixed(2)}</span>
            </p>
            <p>
              Wallet <span>{(funds?.walletBalance || 0).toFixed(2)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({stats.count})</p>
        </span>
        <div className="data">
          <div className="first">
            <h3 className={stats.pnl >= 0 ? "profit" : "loss"}>{stats.pnl.toFixed(2)}</h3>
            <p>P&L</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Current Value <span>{stats.current.toFixed(2)}</span>
            </p>
            <p>
              Investment <span>{stats.invested.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      {marketData.length > 0 && (
        <div className="market-overview">
          <div className="market-overview-header">
            <h3>Market Overview</h3>
            <p className="muted">Live price distribution across {marketData.length} tracked stocks</p>
          </div>
          <div className="market-overview-body">
            <div className="market-overview-chart">
              <DoughnutChart data={chartData} />
            </div>
            <div className="market-overview-list">
              {marketData.map((s) => (
                <div className="market-overview-row" key={s.symbol}>
                  <span className="mo-symbol">{s.symbol}</span>
                  <span className={`mo-change ${s.changePercent >= 0 ? "up" : "down"}`}>
                    {s.changePercent >= 0 ? "+" : ""}
                    {Number(s.changePercent || 0).toFixed(2)}%
                  </span>
                  <span className="mo-price">₹{Number(s.price || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Summary;
