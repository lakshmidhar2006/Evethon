import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },

    // Capability-Based Identity
    organizerEnabled: {
      type: Boolean,
      default: false,
    },
    organizerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none"
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    organizerProfile: {
      organizationName: String,
      contactNumber: String,
      organizationType: String,
      eventCategories: [String],
      experienceLevel: String,
    },

    // Legacy field (deprecated but kept for record/migration safety)
    role: {
      type: String,
      enum: ["student", "organizer", "admin"],
      default: "student",
      index: true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
