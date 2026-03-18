import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";
import { getIO } from "../routes/chat.routes.js"; // Reuse existing io attach logic

export const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const ev = await Event.findOneAndUpdate(
      { _id: eventId, status: "published", remainingSlots: { $gt: 0 } },
      { $inc: { remainingSlots: -1 } },
      { new: true, session }
    );

    if (!ev) {
      await session.abortTransaction();
      return res.status(409).json({ message: "No slots available" });
    }

    const reg = await Registration.create(
      [{ event: eventId, userId: req.user.id, status: "confirmed" }],
      { session }
    );

    await session.commitTransaction();

    // emit socket event
    const io = getIO();
    if (io) {
      io.emit("registration_update", {
        eventId,
        remainingSlots: ev.remainingSlots,
        action: "registered"
      });
    }

    res.status(201).json({ message: "Registered", registration: reg[0] });
  } catch (e) {
    await session.abortTransaction();
    if (e?.code === 11000) return res.status(409).json({ message: "Already registered" });
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Check if user is organizer of this event
    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ message: "Event not found" });

    if (String(ev.createdBy) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const regs = await Registration.find({ event: eventId }).populate("userId", "name email");
    res.json(regs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
