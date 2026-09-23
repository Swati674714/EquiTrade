const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { UserModel } = require("../model/UserModel");
const { asyncHandler } = require("./asyncHandler");

const auth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const err = new Error("Authentication required");
    err.statusCode = 401;
    throw err;
  }

  const decoded = jwt.verify(token, jwtSecret);
  const user = await UserModel.findById(decoded.id).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 401;
    throw err;
  }

  req.user = user;
  next();
});

module.exports = { auth };
