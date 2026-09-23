import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="row p-5 mb-3">
        <h1 className="text-center fs-2">
          We built EquiTrade so retail traders can practice
          <br />
          with a real order engine and a modern desk.
        </h1>
      </div>
      <div className="row mt-4 border-top text-muted" style={{ fontSize: "1.1em", lineHeight: "1.8em" }}>
        <div className="col-md-6 p-5">
          <p>
            EquiTrade is a full-stack demo broker: JWT accounts, wallet funds, market and limit orders,
            brokerage/STT/GST, and a ledger you can audit.
          </p>
          <p>
            Live NSE/BSE feeds are not included. Prices are simulated on the server and pushed over Socket.io,
            with a stub ready for Alpha Vantage later.
          </p>
        </div>
        <div className="col-md-6 p-5">
          <p>
            Admins can review KYC, monitor trades, and close support tickets from the same dashboard.
          </p>
          <p>
            <a href="/product">Product tour</a> of the trading desk, funds, and admin analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
