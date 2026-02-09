import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    payment: {
      status: { type: String, enum: ["none", "pending", "paid", "failed"], default: "none" },
      provider: String,
      chargeId: String,
      amount: Number,
      currency: String
    }
  },
  { timestamps: true }
);

registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Registration = mongoose.model("Registration", registrationSchema);
