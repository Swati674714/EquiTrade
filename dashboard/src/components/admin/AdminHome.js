import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/analytics").then((res) => setAnalytics(res.data)).catch(() => {});
    api.get("/api/admin/users").then((res) => setUsers(res.data)).catch(() => {});
    api.get("/api/admin/orders").then((res) => setOrders(res.data)).catch(() => {});
    api.get("/api/admin/tickets").then((res) => setTickets(res.data)).catch(() => {});
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const setKyc = async (id, kycStatus) => {
    try {
      const res = await api.patch(`/api/admin/users/${id}/kyc`, { kycStatus });
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      toast.success(`KYC ${kycStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const setTicket = async (id, status) => {
    try {
      const res = await api.patch(`/api/admin/tickets/${id}`, { status });
      setTickets((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      toast.success("Ticket updated");
    } catch (err) {
      toast.error("Could not update ticket");
    }
  };

  return (
    <div className="admin-page">
      <h3 className="title">Admin console</h3>
      <div className="admin-tabs">
        {["analytics", "users", "trades", "tickets"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>

      {tab === "analytics" && analytics && (
        <>
          <div className="stat-grid">
            <div className="stat-card"><p>Users</p><h2>{analytics.totalUsers}</h2></div>
            <div className="stat-card"><p>Trades</p><h2>{analytics.totalTrades}</h2></div>
            <div className="stat-card"><p>Volume</p><h2>₹{Number(analytics.totalVolume || 0).toFixed(0)}</h2></div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.series || []}>
                <XAxis dataKey="date" stroke="#9aa4b2" />
                <YAxis stroke="#9aa4b2" />
                <Tooltip />
                <Bar dataKey="volume" fill="#00d09c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ height: 240, marginTop: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.series || []}>
                <XAxis dataKey="date" stroke="#9aa4b2" />
                <YAxis stroke="#9aa4b2" />
                <Tooltip />
                <Line dataKey="trades" stroke="#4184f3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {tab === "users" && (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>KYC</th>
                <th>Wallet</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.kycStatus}</td>
                  <td>{Number(u.walletBalance || 0).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-green" onClick={() => setKyc(u._id, "approved")}>Approve</button>
                    <button className="btn btn-red" onClick={() => setKyc(u._id, "rejected")}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "trades" && (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Symbol</th>
                <th>Side</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Turnover</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.userId?.email || "-"}</td>
                  <td>{o.name}</td>
                  <td>{o.mode}</td>
                  <td>{o.qty}</td>
                  <td>{o.status}</td>
                  <td>{Number(o.turnover || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "tickets" && (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td>{t.userId?.email || "-"}</td>
                  <td>{t.subject}</td>
                  <td>{t.category}</td>
                  <td>{t.status}</td>
                  <td>
                    <button className="btn btn-blue" onClick={() => setTicket(t._id, "in_progress")}>Progress</button>
                    <button className="btn btn-green" onClick={() => setTicket(t._id, "resolved")}>Resolve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
