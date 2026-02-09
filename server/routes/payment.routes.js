import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { checkout, webhook, paymentStatus } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout", verifyToken, checkout);
router.post("/webhook", webhook); // public (provider)
router.get("/:registrationId/status", verifyToken, paymentStatus);
// (optional) refunds → admin only
// router.post("/:registrationId/refund", verifyToken, authorizeRoles("admin"), refundHandler)

export default router;
