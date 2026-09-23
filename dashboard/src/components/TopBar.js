import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  SpaceDashboard,
  ReceiptLong,
  AccountBalanceWallet,
  TrendingUp,
  Savings,
} from "@mui/icons-material";
import "./TopBar.css";

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/", icon: <SpaceDashboard /> },
    { label: "Orders", path: "/orders", icon: <ReceiptLong /> },
    { label: "Holdings", path: "/holdings", icon: <AccountBalanceWallet /> },
    { label: "Positions", path: "/positions", icon: <TrendingUp /> },
    { label: "Funds", path: "/funds", icon: <Savings /> },
  ];

  return (
    <nav className="topbar">
      <div className="topbar-container">
        <div className="topbar-logo" onClick={() => navigate("/")}>
          <span className="logo-icon">₹</span>
          <span className="logo-text">EquiTrade</span>
        </div>

        <div className="topbar-nav-desktop">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <button
                key={link.path}
                className={`nav-link ${active ? "active" : ""}`}
                onClick={() => navigate(link.path)}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </button>
            );
          })}
        </div>

        <div className="topbar-user">
          <div className="user-info">
            <div className="user-initial">{user?.name?.charAt(0)}</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <div className="topbar-nav-mobile">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <button
                key={link.path}
                className={`nav-link-mobile ${active ? "active" : ""}`}
                onClick={() => {
                  navigate(link.path);
                  setMenuOpen(false);
                }}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </button>
            );
          })}
          <button
            className="btn-logout-mobile"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}