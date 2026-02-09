import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createEvent, listEvents, getEvent, updateEvent, submitEvent, closeEvent, getPopularEvents, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();

// public
router.get("/popular", getPopularEvents);
router.get("/", listEvents);
router.get("/:id", getEvent);

// organizer/admin
router.post("/", verifyToken, authorizeRoles("organizer", "admin"), createEvent);
router.patch("/:id/update", verifyToken, authorizeRoles("organizer", "admin"), updateEvent);
router.post("/:id/submit", verifyToken, authorizeRoles("organizer", "admin"), submitEvent);
router.patch("/:id/close", verifyToken, authorizeRoles("organizer", "admin"), closeEvent);
router.delete("/:id", verifyToken, authorizeRoles("organizer", "admin"), deleteEvent);

export default router;
