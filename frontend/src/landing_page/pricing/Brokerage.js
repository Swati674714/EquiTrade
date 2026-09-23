import React from "react";
import { Link } from "react-router-dom";

export default function Brokerage() {
  return (
    <div className="container">
      <div className="row p-5 mt-3 text-center border-top">
        <div className="col-md-8 p-4">
          <Link to="/support">
            <h3 className="fs-5">How charges work</h3>
          </Link>
          <ul style={{ textAlign: "left", lineHeight: "2.2" }} className="text-muted">
            <li>Brokerage = min(₹20, 0.03% of turnover) on each executed order.</li>
            <li>STT = 0.1% of turnover on sell trades.</li>
            <li>GST = 18% of brokerage.</li>
            <li>Pending limit buys lock wallet funds until fill or cancel.</li>
            <li>Add/withdraw is simulated and posted to your ledger immediately.</li>
          </ul>
        </div>
        <div className="col-md-4 p-4">
          <Link to="/support">
            <h3 className="fs-5">Support</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
