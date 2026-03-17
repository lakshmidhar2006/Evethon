import redisClient from "../config/redis.js";

export const cache = (duration) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip caching if redis is not connected (e.g., during tests or if it fails)
    if (!redisClient.isOpen) {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // Override res.json to cache the response before sending
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(key, duration, JSON.stringify(body))
            .catch(err => console.error("Redis set error:", err));
        }
        originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Redis get error:", err);
      next();
    }
  };
};

export const clearCacheMatch = async (pattern) => {
  if (!redisClient.isOpen) return;
  try {
    const keys = await redisClient.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Redis clear cache error:", err);
  }
};
