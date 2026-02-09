import express from "express";
import { verifyAdminBootstrapKey, verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { setUserRole, approveEvent, rejectEvent, publishEvent, closeEventAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

// one-time bootstrap via header key
router.patch("/users/:id/role", verifyAdminBootstrapKey, setUserRole);

// admin-protected event transitions
router.patch("/events/:id/approve", verifyToken, authorizeRoles("admin"), approveEvent);
router.patch("/events/:id/reject", verifyToken, authorizeRoles("admin"), rejectEvent);
router.patch("/events/:id/publish", verifyToken, authorizeRoles("admin"), publishEvent);
router.patch("/events/:id/close", verifyToken, authorizeRoles("admin"), closeEventAdmin);

export default router;
