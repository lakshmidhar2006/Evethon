import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import eventRoutes from "./routes/event.routes.js";
import registrationRoutes from "./routes/registration.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import notifyRoutes from "./routes/notify.routes.js";
import chatRoutes, { attachSocket } from "./routes/chat.routes.js";
import reportRoutes from "./routes/report.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CORS_ORIGIN || "*", credentials: true }
});
attachSocket(io);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

connectDB();

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notify", notifyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportRoutes);

// Global 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
