import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";
import { getIO } from "../routes/chat.routes.js"; // Reuse existing io attach logic

export const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    // Atomic find and update to prevent race conditions
    const ev = await Event.findOneAndUpdate(
      { _id: eventId, status: "published", remainingSlots: { $gt: 0 } },
      { $inc: { remainingSlots: -1 } },
      { new: true }
    );

    if (!ev) {
      const check = await Event.findById(eventId);
      if (!check) return res.status(404).json({ message: "Event not found" });
      if (check.status !== "published") return res.status(400).json({ message: "Event not published" });
      return res.status(409).json({ message: "No slots available" });
    }

    // unique constraint will prevent duplicates
    const reg = await Registration.create({ event: eventId, userId: req.user.id, status: "confirmed" });

    // Emit real-time update
    const io = getIO();
    if (io) {
      io.emit("registration_update", {
        eventId,
        remainingSlots: ev.remainingSlots,
        action: "registered"
      });
    }

    res.status(201).json({ message: "Registered", registration: reg });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Already registered" });
    res.status(500).json({ error: e.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (String(reg.userId) !== String(req.user.id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Not allowed" });

    if (reg.status === "cancelled") return res.status(400).json({ message: "Already cancelled" });

    const ev = await Event.findById(reg.event);
    reg.status = "cancelled";
    await reg.save();
    
    if (ev) {
      ev.remainingSlots += 1;
      await ev.save();
    }

    // Emit real-time update
    const io = getIO();
    if (io && ev) {
      io.emit("registration_update", {
        eventId: reg.event,
        remainingSlots: ev.remainingSlots,
        action: "cancelled"
      });
    }

    res.json({ message: "Cancelled" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const myRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("event");
    res.json(regs);
  } catch (e) {
    console.error("Error in myRegistrations:", e);
    res.status(500).json({ error: e.message });
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
