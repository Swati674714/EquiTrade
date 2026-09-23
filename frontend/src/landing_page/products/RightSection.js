import React from "react";
import { Link } from "react-router-dom";

function RightSection({ imageURL, productName, productDescription, leranMore = "/about" }) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6 p-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <Link to={leranMore || "/about"}>Learn more</Link>
        </div>
        <div className="col-md-6">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
