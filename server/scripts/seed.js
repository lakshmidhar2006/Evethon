import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/evethon";

const seed = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log("🧹 Cleared existing data");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 1. Create Users
    const users = await User.insertMany([
      {
        _id: new mongoose.Types.ObjectId("65f4a1234567890123456789"), // Fixed Admin ID
        name: "Admin Lakshmidhar",
        email: "admin@eventhon.com",
        password: hashedPassword,
        isAdmin: true,
        role: "admin",
      },
      {
        _id: new mongoose.Types.ObjectId("65f4b1234567890123456789"), // Fixed Org ID
        name: "Tech Organizers",
        email: "org@tech.com",
        password: hashedPassword,
        organizerEnabled: true,
        organizerStatus: "approved",
        role: "organizer",
        organizerProfile: {
          organizationName: "Tech Hub",
          organizationType: "Club",
          experienceLevel: "Expert",
        },
      },
      {
        _id: new mongoose.Types.ObjectId("65f4c1234567890123456789"),
        name: "Creative Arts Club",
        email: "arts@college.com",
        password: hashedPassword,
        organizerEnabled: true,
        organizerStatus: "pending",
        role: "organizer",
      },
      {
        _id: new mongoose.Types.ObjectId("65f4d1234567890123456789"),
        name: "John Student",
        email: "john@student.com",
        password: hashedPassword,
        role: "student",
      },
      {
        _id: new mongoose.Types.ObjectId("65f4e1234567890123456789"),
        name: "Jane Student",
        email: "jane@student.com",
        password: hashedPassword,
        role: "student",
      },
    ]);

    const adminId = users[0]._id;
    const techOrgId = users[1]._id;
    const student1Id = users[3]._id;
    const student2Id = users[4]._id;

    console.log("👤 Users seeded");

    // 2. Create Events
    const events = await Event.insertMany([
      {
        title: "Global AI & Robotics Hackathon 2026",
        description: "Join the most innovative minds for a 48-hour buildathon focusing on Generative AI and autonomous systems.",
        schedule: {
          start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          end: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
          timezone: "GMT+5:30",
        },
        location: { type: "venue", address: "Main Campus Auditorium" },
        totalSlots: 100,
        remainingSlots: 98,
        createdBy: techOrgId,
        status: "published",
        audit: { publishedAt: new Date() },
      },
      {
        title: "Web3 & Blockchain Deep Dive",
        description: "Master the fundamentals of Ethereum, Smart Contracts, and DApp development in this intensive workshop.",
        schedule: {
          start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          timezone: "GMT+5:30",
        },
        location: { type: "online", url: "https://zoom.us/j/mock-meeting-id" },
        totalSlots: 50,
        remainingSlots: 49,
        createdBy: techOrgId,
        status: "published",
        audit: { publishedAt: new Date() },
      },
      {
        title: "Digital Art & NFT Workshop",
        description: "Explore the intersection of traditional art and digital ownership.",
        schedule: {
          start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        },
        location: { type: "venue", address: "Arts Block Room 202" },
        totalSlots: 30,
        remainingSlots: 30,
        createdBy: techOrgId,
        status: "submitted",
        audit: { submittedAt: new Date() },
      },
    ]);

    console.log("📅 Events seeded");

    // 3. Create Registrations
    await Registration.insertMany([
      {
        eventId: events[0]._id,
        userId: student1Id,
        status: "confirmed",
      },
      {
        eventId: events[0]._id,
        userId: student2Id,
        status: "confirmed",
      },
      {
        eventId: events[1]._id,
        userId: student1Id,
        status: "confirmed",
      },
    ]);

    console.log("📝 Registrations seeded");

    console.log("✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
