import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

let isConnected = false;

export const getRedisClient = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client;
};

// Deprecated: use getRedisClient() instead if possible to avoid top-level await issues
// keeping it export for backward compatibility but it won't be connected by default
export const redis = client;
