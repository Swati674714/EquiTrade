import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { usePrices } from "../context/SocketContext";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { prices } = usePrices();

  useEffect(() => {
    api
      .get("/api/positions")
      .then((res) => setPositions(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(
    () =>
      positions.map((stock) => {
        const last = prices[stock.name]?.lastPrice ?? stock.price;
        const pnl = last * stock.qty - stock.avg * stock.qty;
        return { ...stock, price: last, pnl };
      }),
    [positions, prices]
  );

  if (loading) return <div className="skeleton-table" />;

  if (!rows.length) {
    return (
      <div className="empty-state">
        <h3>No open positions</h3>
        <p>CNC positions appear here after you buy a stock.</p>
        <Link to="/" className="btn btn-green">Start trading</Link>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Positions ({rows.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((stock) => (
              <tr key={stock._id || stock.name}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td className={stock.pnl >= 0 ? "profit" : "loss"}>{stock.pnl.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
