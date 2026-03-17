import { Event } from "../models/event.model.js";
import { clearCacheMatch } from "../middleware/cache.middleware.js";

const isOwner = (uid, oid) => String(uid) === String(oid);

export const createEvent = async (req, res) => {
  try {
    if (!req.user.isAdmin && req.user.organizerStatus !== "approved") {
      return res.status(403).json({ message: "Organizer approval pending or missing." });
    }

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
    
    await clearCacheMatch("/api/events*");
    
    res.status(201).json({ message: "Event created (submitted)", event: ev });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listEvents = async (req, res) => {
  try {
    const { status, organizerId } = req.query;
    const q = {};
    if (status) q.status = status;
    if (organizerId) q.createdBy = organizerId;
    const events = await Event.find(q).sort({ createdAt: -1 });
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getPopularEvents = async (req, res) => {
  try {
    // Since we don't have a registration count field on Event yet, 
    // we'll just sort by published date or remaining slots for now.
    const events = await Event.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(events);
  } catch (e) {
    console.error("Error in getPopularEvents:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Renamed from updateDraft to updateEvent and removed draft-only restriction
export const updateEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });

    if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });

    Object.assign(ev, req.body);
    if (typeof ev.totalSlots === "number" && !ev.remainingSlots) ev.remainingSlots = ev.totalSlots; 

    await ev.save();
    await clearCacheMatch("/api/events*");
    res.json({ message: "Event updated", event: ev });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const submitEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });
    if (ev.status !== "draft" && ev.status !== "submitted") return res.status(400).json({ message: `Only draft/submitted can be submitted` });
    ev.status = "submitted";
    ev.audit.submittedAt = new Date();
    await ev.save();
    await clearCacheMatch("/api/events*");
    res.json({ message: "Submitted for approval", event: ev });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const closeEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    const can = req.user.role === "admin" || isOwner(ev.createdBy, req.user.id);
    if (!can) return res.status(403).json({ message: "Not allowed" });
    if (!["approved", "published"].includes(ev.status)) return res.status(400).json({ message: "Invalid state to close" });
    ev.status = "closed";
    ev.audit.closedAt = new Date();
    await ev.save();
    await clearCacheMatch("/api/events*");
    res.json({ message: "Event closed", event: ev });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    if (!isOwner(ev.createdBy, req.user.id) && req.user.role !== "admin") return res.status(403).json({ message: "Not owner" });

    await ev.deleteOne();
    await clearCacheMatch("/api/events*");
    res.json({ message: "Event deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
