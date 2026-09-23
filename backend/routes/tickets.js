const express = require("express");
const { body } = require("express-validator");
const { TicketModel } = require("../model/TicketModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const tickets = await TicketModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  })
);

router.post(
  "/",
  auth,
  [
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const ticket = await TicketModel.create({
      userId: req.user._id,
      subject: req.body.subject,
      category: req.body.category,
      message: req.body.message,
    });
    res.status(201).json(ticket);
  })
);

module.exports = router;
