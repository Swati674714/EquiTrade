import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="hero-band">
      <div className="container p-5">
        <div className="row text-center">
          <img src="media/images/photos/homeHero.png" alt="EquiTrade trading platform" className="mb-5 hero-img" />
          <h1 className="mt-4">Invest in everything</h1>
          <p>Online platform to trade stocks with live simulated prices, wallet funds, and a full order book.</p>
          <Link to="/signup" className="cta-btn">Signup Now</Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
