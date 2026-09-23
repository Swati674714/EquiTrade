import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { usePrices } from "../context/SocketContext";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { prices } = usePrices();

  const load = async () => {
    try {
      const res = await api.get("/api/holdings");
      setAllHoldings(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(
    () =>
      allHoldings.map((stock) => {
        const last = prices[stock.name]?.lastPrice ?? stock.price;
        const curValue = last * stock.qty;
        const pnl = curValue - stock.avg * stock.qty;
        return { ...stock, price: last, curValue, pnl };
      }),
    [allHoldings, prices]
  );

  const totals = rows.reduce(
    (acc, row) => {
      acc.invested += row.avg * row.qty;
      acc.current += row.curValue;
      return acc;
    },
    { invested: 0, current: 0 }
  );

  if (loading) return <div className="skeleton-table" />;

  if (!rows.length) {
    return (
      <div className="empty-state">
        <h3>No holdings yet</h3>
        <p>Start trading from the watchlist to build your portfolio.</p>
        <Link to="/" className="btn btn-green">Go to watchlist</Link>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Holdings ({rows.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((stock) => (
              <tr key={stock._id || stock.name}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{stock.curValue.toFixed(2)}</td>
                <td className={stock.pnl >= 0 ? "profit" : "loss"}>{stock.pnl.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row">
        <div className="col">
          <h5>{totals.invested.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>{totals.current.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totals.current - totals.invested >= 0 ? "profit" : "loss"}>
            {(totals.current - totals.invested).toFixed(2)}
          </h5>
          <p>P&L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;
