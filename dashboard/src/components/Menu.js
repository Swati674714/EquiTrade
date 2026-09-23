import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || "ET")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="menu-container">
      <div className="brand">EquiTrade</div>
      <div className="menus">
        <ul>
          {[
            ["Dashboard", "/", 0],
            ["Orders", "/orders", 1],
            ["Holdings", "/holdings", 2],
            ["Positions", "/positions", 3],
            ["Funds", "/funds", 4],
          ].map(([label, to, idx]) => (
            <li key={to}>
              <Link style={{ textDecoration: "none" }} to={to} onClick={() => setSelectedMenu(idx)}>
                <p className={selectedMenu === idx ? "menu selected" : "menu"}>{label}</p>
              </Link>
            </li>
          ))}
          {isAdmin && (
            <li>
              <Link style={{ textDecoration: "none" }} to="/admin" onClick={() => setSelectedMenu(8)}>
                <p className={selectedMenu === 8 ? "menu selected" : "menu"}>Admin</p>
              </Link>
            </li>
          )}
        </ul>
        <hr />
        <div className="profile" onClick={() => setIsProfileDropdownOpen((v) => !v)}>
          <div className="avatar">{initials}</div>
          <p className="username">{user?.name || "USER"}</p>
        </div>
        {isProfileDropdownOpen && (
          <div className="profile-drop">
            <p>{user?.email}</p>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
