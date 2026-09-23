import React from "react";

import Hero from "./Hero";
import LeftSection from "./LeftSection.js";
import RightSection from "./RightSection.js";
import Universe from "./Universe.js";

function PricingPage() {
  return (
    <>
      <Hero />
      <LeftSection
        imageURL="media\images\photos\kite.png"
        productName="Trading desk"
        productDescription="Our flagship trading platform with streaming simulated market data, charts, an elegant UI, and more."
        leranMore="/about"
        tryDemo="/signup"
        googlePlay="/signup"
        appStore="/signup"
      />
      <RightSection 
        imageURL="media/images/photos/console.png"
        productName="Console"
        productDescription="The central dashboard for your EquiTrade account. Gain insights into your trades and investments."
        leranMore="/about"
        />
      <LeftSection
        imageURL="media/images/photos/coin.png"
        productName="Funds"
        productDescription="Add and withdraw simulated capital instantly. Every movement is stored in your ledger."
        leranMore="/pricing"
        tryDemo="/signup"
        googlePlay="/signup"
        appStore="/signup"
      />
      <RightSection 
        imageURL="media/images/photos/kiteconnect.png"
        productName="Market data API"
        productDescription="Prices come from an in-house simulator today, with a plug-in point for Alpha Vantage later."
        leranMore="/about"
      />
      <LeftSection
        imageURL="media/images/photos/varsity.png"
        productName="Learn"
        productDescription="Practice market and limit orders, brokerage, and KYC flows before you ever use a live broker."
        tryDemo="/support"
        leranMore="/support"
        googlePlay="/signup"
        appStore="/signup"
      />
      <p className="text-center mt-5">
        Want to know more? Read the pricing page or open a support ticket.
      </p>
      <Universe />
    </>
  );
}

export default PricingPage;
