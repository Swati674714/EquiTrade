import React from "react";
import { Link } from "react-router-dom";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>EquiTrade universe</h1>
        <p>Everything you need to practice trading in one stack</p>
        <div className="col-md-4 p-3 mt-4">
          <h5>Trading desk</h5>
          <p className="text-muted">Watchlist, orders, holdings, and live prices</p>
        </div>
        <div className="col-md-4 p-3 mt-4">
          <h5>Wallet</h5>
          <p className="text-muted">Add, withdraw, and a full ledger</p>
        </div>
        <div className="col-md-4 p-3 mt-4">
          <h5>Admin</h5>
          <p className="text-muted">KYC, tickets, and volume analytics</p>
        </div>
        <Link to="/signup" className="cta-btn mb-5">Signup now</Link>
      </div>
    </div>
  );
}

export default Universe;
