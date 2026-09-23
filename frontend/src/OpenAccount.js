import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container p-5">
      <div className="row text-center">
        <h1 className="mt-5">Open an EquiTrade account</h1>
        <p>Modern trading desk, ₹0 delivery brokerage in this demo, and live price simulation.</p>
        <Link to="/signup" className="cta-btn">Sign up now</Link>
      </div>
    </div>
  );
}

export default OpenAccount;
