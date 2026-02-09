import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { User } from '../models/user.model.js';

const router = express.Router();

router.post('/organizer', verifyToken, async (req, res) => {
    try {
        const { organizationName, organizationType, contactNumber, eventCategories, experienceLevel } = req.body;

        // Validation
        if (!organizationName || !contactNumber) {
            return res.status(400).json({ message: "Organization Name and Contact Number are required" });
        }

        // Idempotency check
        if (req.user.organizerEnabled) {
            return res.status(400).json({ message: "User is already an organizer" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                organizerEnabled: true,
                organizerProfile: {
                    organizationName,
                    organizationType,
                    contactNumber,
                    eventCategories,
                    experienceLevel
                }
            },
            { new: true }
        );

        res.json({
            message: "Organizer capability enabled",
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                organizerEnabled: updatedUser.organizerEnabled,
                isAdmin: updatedUser.isAdmin,
                organizerProfile: updatedUser.organizerProfile
            }
        });

    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
