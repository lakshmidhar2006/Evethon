import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createEvent, listEvents, getEvent, updateDraft, submitEvent, closeEvent } from "../controllers/event.controller.js";

const router = express.Router();

// public
router.get("/", listEvents);
router.get("/:id", getEvent);

// organizer/admin
router.post("/", verifyToken, authorizeRoles("organizer", "admin"), createEvent);
router.patch("/:id/update", verifyToken, authorizeRoles("organizer", "admin"), updateDraft);
router.post("/:id/submit", verifyToken, authorizeRoles("organizer", "admin"), submitEvent);
router.patch("/:id/close", verifyToken, authorizeRoles("organizer", "admin"), closeEvent);

export default router;
