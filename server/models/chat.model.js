import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["announcement", "message"], default: "message" },
    body: String,
    flags: { edited: Boolean, removed: Boolean }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
