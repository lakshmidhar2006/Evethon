import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { sendEmail } from "../controllers/notify.controller.js";

const router = express.Router();
router.post("/email", verifyToken, authorizeRoles("admin"), sendEmail);
export default router;
