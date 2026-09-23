import React from "react";

function Awards() {
  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6 p-5">
          <img src="media/images/photos/largestBroker.svg" alt="Largest broker illustration" />
        </div>
        <div className="col-md-6 p-5">
          <h1>Built for serious retail traders</h1>
          <p className="mb-4">
            EquiTrade gives you a Kite-style desk: watchlist, holdings, positions, funds, and an admin console — with user-isolated data.
          </p>
          <div className="row">
            <div className="col-6">
              <ul>
                <li><p>Equity delivery</p></li>
                <li><p>Market and limit orders</p></li>
                <li><p>Live simulated prices</p></li>
              </ul>
            </div>
            <div className="col-6">
              <ul>
                <li><p>Wallet add / withdraw</p></li>
                <li><p>KYC and support tickets</p></li>
                <li><p>Admin analytics</p></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Awards;
