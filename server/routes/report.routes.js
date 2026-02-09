import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { exportRegistrations } from "../controllers/report.controller.js";

const router = express.Router();
router.get("/registrations", verifyToken, authorizeRoles("organizer", "admin"), exportRegistrations);

export default router;
