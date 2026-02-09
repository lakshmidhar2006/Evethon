import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: "text" },
    description: String,
    schedule: { start: Date, end: Date, timezone: String },
    location: { type: { type: String, enum: ["online", "venue"], default: "venue" }, url: String, address: String },
    totalSlots: { type: Number, default: 0 },
    remainingSlots: { type: Number, default: 0, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected", "published", "closed"],
      default: "draft",
      index: true
    },
    audit: {
      submittedAt: Date,
      approvedAt: Date,
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rejectedAt: Date,
      rejectReason: String,
      publishedAt: Date,
      closedAt: Date
    }
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, "schedule.start": 1 });

export const Event = mongoose.model("Event", eventSchema);
