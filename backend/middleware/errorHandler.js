function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors || {}).map((e) => e.message),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value already exists" });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
}

module.exports = { errorHandler };
