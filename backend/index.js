require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const { port, corsOrigins, jwtSecret } = require("./config/env");
const { connectDb } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");
const { startPriceSimulator } = require("./services/priceSimulator");

const authRoutes = require("./routes/auth");
const holdingsRoutes = require("./routes/holdings");
const positionsRoutes = require("./routes/positions");
const ordersRoutes = require("./routes/orders");
const fundsRoutes = require("./routes/funds");
const marketRoutes = require("./routes/market");
const ticketsRoutes = require("./routes/tickets");
const alertsRoutes = require("./routes/alerts");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: corsOrigins, credentials: true },
});

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "equitrade-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/holdings", holdingsRoutes);
app.use("/api/positions", positionsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/funds", fundsRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/admin", adminRoutes);

// Backward-compatible aliases used by the existing dashboard
app.use("/allHoldings", holdingsRoutes);
app.use("/allPositions", positionsRoutes);
app.use("/newOrder", ordersRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    const decoded = jwt.verify(token, jwtSecret);
    socket.userId = decoded.id;
    socket.join(`user:${decoded.id}`);
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.emit("connected", { userId: socket.userId });
});

async function start() {
  await connectDb();
  startPriceSimulator(io);
  server.listen(port, () => {
    console.log(`EquiTrade API listening on ${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
