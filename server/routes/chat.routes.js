import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getHistory, removeMessage } from "../controllers/chat.controller.js";
import { ChatMessage } from "../models/chat.model.js";

let ioRef = null;

// Socket.io attach
export function attachSocket(io) {
  ioRef = io;
  io.on("connection", (socket) => {
    socket.on("join", ({ eventId, user }) => {
      socket.join(`event:${eventId}`);
    });
    socket.on("message", async ({ eventId, userId, body }) => {
      const msg = await ChatMessage.create({ eventId, userId, body, type: "message" });
      io.to(`event:${eventId}`).emit("message", msg);
    });
    socket.on("announcement", async ({ eventId, userId, body }) => {
      const msg = await ChatMessage.create({ eventId, userId, body, type: "announcement" });
      io.to(`event:${eventId}`).emit("announcement", msg);
    });
  });
}

const router = express.Router();
router.get("/:eventId", verifyToken, getHistory);
router.delete("/:messageId", verifyToken, authorizeRoles("organizer", "admin"), removeMessage);
export default router;
