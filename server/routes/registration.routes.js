import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { registerForEvent, cancelRegistration, myRegistrations } from "../controllers/registration.controller.js";

const router = express.Router();

router.post("/", verifyToken, registerForEvent);
router.get("/me", verifyToken, myRegistrations);
router.delete("/:id", verifyToken, cancelRegistration);

export default router;
