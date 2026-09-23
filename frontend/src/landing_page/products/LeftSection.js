import React from "react";
import { Link } from "react-router-dom";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo = "/signup",
  leranMore = "/about",
  googlePlay = "/signup",
  appStore = "/signup",
}) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
        <div className="col-md-6 p-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <div>
            <Link to={tryDemo || "/signup"}>Try demo</Link>
            <Link to={leranMore || "/about"} style={{ marginLeft: "50px" }}>Learn more</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
