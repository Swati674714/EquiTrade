const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const express = require("express");
const { UserModel } = require("../model/UserModel");
const { jwtSecret, jwtExpiresIn } = require("../config/env");
const { asyncHandler } = require("../middleware/asyncHandler");
const { validate } = require("../middleware/validate");
const { auth } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimits");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
}

router.post(
  "/signup",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").optional().isString(),
    body("pan").optional().isString(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password, phone, pan } = req.body;
    const exists = await UserModel.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      phone: phone || "",
      pan: pan || "",
    });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  })
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: user.toSafeJSON() });
  })
);

router.get(
  "/me",
  auth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user.toSafeJSON() });
  })
);

module.exports = router;
