import { ChatMessage } from "../models/chat.model.js";

export const getHistory = async (req, res) => {
  const { eventId } = req.params;
  const msgs = await ChatMessage.find({ eventId }).sort({ createdAt: -1 }).limit(100);
  res.json(msgs);
};

export const removeMessage = async (req, res) => {
  const { messageId } = req.params;
  const msg = await ChatMessage.findById(messageId);
  if (!msg) return res.status(404).json({ message: "Not found" });
  // Organizer/Admin guard should be on route
  msg.flags = msg.flags || {};
  msg.flags.removed = true;
  await msg.save();
  res.json({ message: "Removed" });
};
