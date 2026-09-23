const express = require("express");
const { body, param } = require("express-validator");
const { UserModel } = require("../model/UserModel");
const { OrdersModel } = require("../model/OrdersModel");
const { TicketModel } = require("../model/TicketModel");
const { asyncHandler } = require("../middleware/asyncHandler");
const { auth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.use(auth, requireAdmin);

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await UserModel.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  })
);

router.patch(
  "/users/:id/kyc",
  [param("id").isMongoId(), body("kycStatus").isIn(["pending", "approved", "rejected"])],
  validate,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { kycStatus: req.body.kycStatus },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  })
);

router.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const orders = await OrdersModel.find({}).populate("userId", "name email").sort({ createdAt: -1 }).limit(200);
    res.json(orders);
  })
);

router.get(
  "/tickets",
  asyncHandler(async (req, res) => {
    const tickets = await TicketModel.find({}).populate("userId", "name email").sort({ createdAt: -1 });
    res.json(tickets);
  })
);

router.patch(
  "/tickets/:id",
  [
    param("id").isMongoId(),
    body("status").optional().isIn(["open", "in_progress", "resolved", "closed"]),
    body("adminNote").optional().isString(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const ticket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.status ? { status: req.body.status } : {}),
        ...(req.body.adminNote !== undefined ? { adminNote: req.body.adminNote } : {}),
      },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  })
);

router.get(
  "/analytics",
  asyncHandler(async (req, res) => {
    const [totalUsers, totalTrades, volumeAgg, recent] = await Promise.all([
      UserModel.countDocuments({ role: "user" }),
      OrdersModel.countDocuments({ status: "EXECUTED" }),
      OrdersModel.aggregate([
        { $match: { status: "EXECUTED" } },
        { $group: { _id: null, volume: { $sum: "$turnover" } } },
      ]),
      OrdersModel.aggregate([
        { $match: { status: "EXECUTED" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            volume: { $sum: "$turnover" },
            trades: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 14 },
      ]),
    ]);

    res.json({
      totalUsers,
      totalTrades,
      totalVolume: volumeAgg[0]?.volume || 0,
      series: recent.map((row) => ({ date: row._id, volume: row.volume, trades: row.trades })),
    });
  })
);

module.exports = router;
