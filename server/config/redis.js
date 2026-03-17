import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Redis retry limit reached");
      return Math.min(retries * 100, 3000);
    },
    connectTimeout: 10000,
  }
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
redisClient.on("connect", () => console.log("🚀 Redis Client Connected"));
redisClient.on("reconnecting", () => console.log("🔄 Redis Client Reconnecting..."));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err.message);
    // Don't crash the server, just log the error
  }
};

export default redisClient;
