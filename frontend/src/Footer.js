import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="eq-footer">
      <div className="container border-top mt-5 pt-4">
        <div className="row mt-4">
          <div className="col-md-3">
            <p className="brand">EquiTrade</p>
            <p>&copy; {new Date().getFullYear()} EquiTrade Broking (demo). All rights reserved.</p>
          </div>
          <div className="col-md-3">
            <p>Company</p>
            <Link to="/about">About</Link>
            <br />
            <Link to="/pricing">Pricing</Link>
            <br />
            <Link to="/product">Products</Link>
            <br />
            <Link to="/signup">Open an account</Link>
          </div>
          <div className="col-md-3">
            <p>Support</p>
            <Link to="/support">Support portal</Link>
            <br />
            <Link to="/support#ticket-form">Create a ticket</Link>
            <br />
            <Link to="/pricing">List of charges</Link>
          </div>
          <div className="col-md-3">
            <p>Account</p>
            <Link to="/signup">Open an account</Link>
            <br />
            <Link to="/login">Fund transfer (after login)</Link>
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p>
            EquiTrade is a simulated trading platform for education and demonstration.
            Investments in securities markets are subject to market risks.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
