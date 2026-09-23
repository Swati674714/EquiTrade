import React from "react";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-4">
          <h1 className="mb-3 fs-2">Transparent pricing</h1>
          <p>Brokerage is the lower of ₹20 or 0.03% of turnover, plus STT on sells and GST on brokerage.</p>
          <Link to="/pricing">See pricing</Link>
        </div>
        <div className="col-md-8">
          <div className="row text-center">
            <div className="col p-4 border rounded-3 m-2">
              <h1 className="mb-3">₹0</h1>
              <p>Account opening in this demo</p>
            </div>
            <div className="col p-4 border rounded-3 m-2">
              <h1 className="mb-3">₹20</h1>
              <p>Cap per executed order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
