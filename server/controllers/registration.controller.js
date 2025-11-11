import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";

export const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const ev = await Event.findById(eventId).session(session);
    if (!ev) { await session.abortTransaction(); return res.status(404).json({ message: "Event not found" }); }
    if (ev.status !== "published") { await session.abortTransaction(); return res.status(400).json({ message: "Event not published" }); }
    if (ev.remainingSlots <= 0) { await session.abortTransaction(); return res.status(409).json({ message: "No slots available" }); }

    // unique constraint will prevent duplicates
    const reg = await Registration.create([{ eventId, userId: req.user.id, status: "confirmed" }], { session });
    ev.remainingSlots -= 1;
    await ev.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: "Registered", registration: reg[0] });
  } catch (e) {
    await session.abortTransaction();
    if (e?.code === 11000) return res.status(409).json({ message: "Already registered" });
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};

export const cancelRegistration = async (req, res) => {
  const reg = await Registration.findById(req.params.id);
  if (!reg) return res.status(404).json({ message: "Registration not found" });
  if (String(reg.userId) !== String(req.user.id) && req.user.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const ev = await Event.findById(reg.eventId).session(session);
    reg.status = "cancelled";
    await reg.save({ session });
    if (ev) {
      ev.remainingSlots += 1;
      await ev.save({ session });
    }
    await session.commitTransaction();
    res.json({ message: "Cancelled" });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};

export const myRegistrations = async (req, res) => {
  const regs = await Registration.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(regs);
};
