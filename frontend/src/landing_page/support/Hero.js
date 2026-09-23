import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5" id="supportWrapper">
        <h4>Support Portal</h4>
        <Link to="/support#ticket-form">Create a ticket</Link>
      </div>
      <div className="row p-5 m-3">
        <div className="col-md-6 p-3">
          <h1 className="fs-3">Search help topics or raise a ticket below</h1>
          <p>Account opening, KYC, funds, orders, and the trading desk.</p>
        </div>
        <div className="col-md-6 p-3">
          <h1 className="fs-3">Featured</h1>
          <ol>
            <li><Link to="/pricing">How brokerage, STT and GST are calculated</Link></li>
            <li><Link to="/signup">Open a demo trading account</Link></li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
