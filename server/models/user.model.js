import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "organizer", "admin"], default: "student", index: true }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
