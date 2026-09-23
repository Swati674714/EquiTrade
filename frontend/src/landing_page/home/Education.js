import React from "react";
import { Link } from "react-router-dom";

function Education() {
  return (
    <div className="container mb-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img src="media/images/photos/education.svg" alt="Education" style={{ width: "70%" }} />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3 fs-2">Learn as you trade</h1>
          <p>Use simulated prices and a real ledger so you can practice orders without a live exchange feed.</p>
          <Link to="/support">Support & FAQs</Link>
          <p className="mt-4">Need help with KYC or funds? Raise a ticket from the support page.</p>
          <Link to="/support#ticket-form">Create a ticket</Link>
        </div>
      </div>
    </div>
  );
}

export default Education;
