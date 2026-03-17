import express from "express";
import { verifyAdminBootstrapKey, verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { setUserRole, approveEvent, rejectEvent, publishEvent, closeEventAdmin, approveOrganizer, rejectOrganizer, getPendingOrganizers } from "../controllers/admin.controller.js";

const router = express.Router();

// one-time bootstrap via header key
router.patch("/users/:id/role", verifyAdminBootstrapKey, setUserRole);

// Organizer approvals
router.get("/users/pending-organizers", verifyToken, authorizeRoles("admin"), getPendingOrganizers);
router.patch("/users/:id/approve-organizer", verifyToken, authorizeRoles("admin"), approveOrganizer);
router.patch("/users/:id/reject-organizer", verifyToken, authorizeRoles("admin"), rejectOrganizer);

// admin-protected event transitions
router.patch("/events/:id/approve", verifyToken, authorizeRoles("admin"), approveEvent);
router.patch("/events/:id/reject", verifyToken, authorizeRoles("admin"), rejectEvent);
router.patch("/events/:id/publish", verifyToken, authorizeRoles("admin"), publishEvent);
router.patch("/events/:id/close", verifyToken, authorizeRoles("admin"), closeEventAdmin);

export default router;
