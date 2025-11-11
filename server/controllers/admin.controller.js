import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";

export const setUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["student", "organizer", "admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const approveEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (ev.status !== "submitted") return res.status(400).json({ message: `Only submitted can be approved` });
  ev.status = "approved";
  ev.audit.approvedAt = new Date();
  ev.audit.approvedBy = req.user.id;
  await ev.save();
  res.json({ message: "Event approved", event: ev });
};

export const rejectEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (ev.status !== "submitted") return res.status(400).json({ message: `Only submitted can be rejected` });
  ev.status = "rejected";
  ev.audit.rejectedAt = new Date();
  ev.audit.rejectReason = req.body.reason || "Not specified";
  await ev.save();
  res.json({ message: "Event rejected", event: ev });
};

export const publishEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (ev.status !== "approved") return res.status(400).json({ message: `Only approved can be published` });
  ev.status = "published";
  ev.audit.publishedAt = new Date();
  await ev.save();
  res.json({ message: "Event published", event: ev });
};

export const closeEventAdmin = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (!["approved", "published"].includes(ev.status)) return res.status(400).json({ message: "Invalid state to close" });
  ev.status = "closed";
  ev.audit.closedAt = new Date();
  await ev.save();
  res.json({ message: "Event closed", event: ev });
};
