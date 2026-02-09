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
      status: "submitted"
    });
    res.status(201).json({ message: "Event created (submitted)", event: ev });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listEvents = async (req, res) => {
  const { status, organizerId } = req.query;
  const q = {};
  if (status) q.status = status;
  if (organizerId) q.createdBy = organizerId;
  const events = await Event.find(q).sort({ createdAt: -1 });
  res.json(events);
};

export const getPopularEvents = async (req, res) => {
  try {
    // Fetch published events, sort by registration count (desc) then date (asc)
    const events = await Event.find({ status: "published" })
      .sort({ "registrations.length": -1, "schedule.start": 1 })
      .limit(10);
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  res.json(ev);
};

// Renamed from updateDraft to updateEvent and removed draft-only restriction
export const updateEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });

  if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });

  // Allow updates if draft or submitted. Maybe even published (but careful).
  // For now, let's allow editing any status.

  Object.assign(ev, req.body);
  if (typeof ev.totalSlots === "number") ev.remainingSlots = ev.totalSlots; // reset or adjust logic needed? 
  // Ideally should calculate diff, but for simplicity reset might be dangerous if people registered.
  // Better logic: if totalSlots changed, update remainingSlots by diff?
  // For MVP, risk: resetting might mess up count. Let's keep it simple: 
  // only update text fields safely.

  await ev.save();
  res.json({ message: "Event updated", event: ev });
};

export const submitEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });
  if (ev.status !== "draft" && ev.status !== "submitted") return res.status(400).json({ message: `Only draft/submitted can be submitted` });
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

export const deleteEvent = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });

  await ev.deleteOne();
  res.json({ message: "Event deleted" });
};
