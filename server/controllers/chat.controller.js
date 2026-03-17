import { ChatMessage } from "../models/chat.model.js";

export const getHistory = async (req, res) => {
  try {
    const { eventId } = req.params;
    const msgs = await ChatMessage.find({ eventId }).sort({ createdAt: -1 }).limit(100);
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const removeMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const msg = await ChatMessage.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Not found" });
    // Organizer/Admin guard should be on route
    msg.flags = msg.flags || {};
    msg.flags.removed = true;
    await msg.save();
    res.json({ message: "Removed" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
