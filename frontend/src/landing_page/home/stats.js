import React from "react";
import { Link } from "react-router-dom";

function Stats() {
  return (
    <div className="container p-3">
      <div className="row p-md-5">
        <div className="col-md-6 p-4">
          <h1 className="fs-2 mb-5">Trust with confidence</h1>
          <h2 className="fs-4">Your data stays yours</h2>
          <p className="text-muted">JWT auth isolates holdings, orders, and funds per account.</p>
          <h2 className="fs-4">No spam or gimmicks</h2>
          <p className="text-muted">Clean dark UI, explicit charges, and toast confirmations on every trade.</p>
          <h2 className="fs-4">The EquiTrade desk</h2>
          <p className="text-muted">Watchlist, order book, wallet ledger, and admin oversight in one product.</p>
        </div>
        <div className="col-md-6">
          <img src="media/images/photos/ecosystem.png" alt="Product ecosystem" style={{ width: "90%" }} />
          <div className="text-center mt-3">
            <Link to="/product" className="mx-3">Explore our products</Link>
            <a href={process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001"}>Try the trading desk</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
