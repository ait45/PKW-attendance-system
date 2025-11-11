import { LRUCache } from "lru-cache";

export const limiter = new LRUCache({
    max: 1000,
    ttl: 60 * 1000
});