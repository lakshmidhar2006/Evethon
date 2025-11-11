import { Event } from "../models/event.model.js";

const isOwner = (uid, oid) => String(uid) === String(oid);

export const createEvent = async (req, res) => {
  try {
    const { title, description, schedule, location, totalSlots } = req.body;
    const ev = await Event.create({
      title,
      description,
      schedule,
      location,
      totalSlots,
      remainingSlots: totalSlots || 0,
      createdBy: req.user.id,
      status: "draft"
    });
    res.status(201).json({ message: "Event created (draft)", event: ev });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listEvents = async (req, res) => {
  const { status } = req.query;
  const q = status ? { status } : {};
  const events = await Event.find(q).sort({ createdAt: -1 });
  res.json(events);
};

export const getEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  res.json(ev);
};

export const updateDraft = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });
  if (ev.status !== "draft") return res.status(400).json({ message: "Only draft can be updated" });
  Object.assign(ev, req.body);
  if (typeof ev.totalSlots === "number") ev.remainingSlots = ev.totalSlots; // reset on update
  await ev.save();
  res.json({ message: "Draft updated", event: ev });
};

export const submitEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });
  if (ev.status !== "draft") return res.status(400).json({ message: `Only draft can be submitted` });
  ev.status = "submitted";
  ev.audit.submittedAt = new Date();
  await ev.save();
  res.json({ message: "Submitted for approval", event: ev });
};

export const closeEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  const can = req.user.role === "admin" || isOwner(ev.createdBy, req.user.id);
  if (!can) return res.status(403).json({ message: "Not allowed" });
  if (!["approved", "published"].includes(ev.status)) return res.status(400).json({ message: "Invalid state to close" });
  ev.status = "closed";
  ev.audit.closedAt = new Date();
  await ev.save();
  res.json({ message: "Event closed", event: ev });
};
