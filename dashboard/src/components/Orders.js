import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await api.get("/api/orders");
    setOrders(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    try {
      await api.post(`/api/orders/${id}/cancel`);
      toast.success("Order cancelled");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <div className="skeleton-table" />;

  if (!orders.length) {
    return (
      <div className="orders empty-state">
        <h3>No orders yet</h3>
        <p>You haven't placed any orders. Buy from the watchlist to get started.</p>
        <Link to="/" className="btn btn-green">Get started</Link>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Order book</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th>Charges</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.name}</td>
                <td className={order.mode === "BUY" ? "profit" : "loss"}>{order.mode}</td>
                <td>{order.orderType}</td>
                <td>{order.qty}</td>
                <td>{(order.executedPrice || order.price || 0).toFixed(2)}</td>
                <td>{order.status}</td>
                <td>₹{(order.charges?.total || 0).toFixed(2)}</td>
                <td>
                  {order.status === "PENDING" && (
                    <button className="btn btn-grey" onClick={() => cancel(order._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
