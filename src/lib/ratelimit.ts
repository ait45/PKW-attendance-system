import { LRUCache } from "lru-cache";

export const limiter = new LRUCache<string, number>({
  max: 1000,
  ttl: 60 * 1000,
  updateAgeOnGet: false,
});
