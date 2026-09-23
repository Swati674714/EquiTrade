import React from "react";
import { Link } from "react-router-dom";

export default function Team() {
  return (
    <div className="container">
      <div className="row p-5 mt-3 border-top">
        <h1 className="text-center">People</h1>
      </div>
      <div className="row p-5 text-muted" style={{ fontSize: "1.1em", lineHeight: "1.8em" }}>
        <div className="col-md-6 p-4 text-center">
          <img src="media/images/photos/nithinKamath.jpg" alt="Founder" style={{ borderRadius: "100%", width: "50%" }} />
          <h4 className="mt-4">Product team</h4>
          <h5>EquiTrade</h5>
        </div>
        <div className="col-md-6 p-4">
          <p>
            EquiTrade is an educational rebuild of a retail trading stack — authentication, a matching-style
            order engine, and an admin console.
          </p>
          <p>Connect on <Link to="/">Homepage</Link> / <Link to="/support">Support</Link></p>
        </div>
      </div>
    </div>
  );
}
