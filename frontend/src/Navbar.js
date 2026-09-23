import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const dashboard = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";
  return (
    <nav className="navbar navbar-expand-lg eq-nav">
      <div className="container p-2">
        <Link className="navbar-brand brand" to="/">
          EquiTrade
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Signup</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pricing">Pricing</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">Support</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={dashboard}>Trade</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
