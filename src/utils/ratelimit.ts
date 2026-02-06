import { LRUCache } from "lru-cache";

export const limiter = new LRUCache<string, number>({
  max: 1000,
  ttl: 60 * 1000,
  updateAgeOnGet: false,
});
// จำกัดการเข้าสู่ระบบ ภายใน 1 นาที
export function checkRatelimit(ip: string, limit: number = 5): boolean {
  const count: number = limiter.get(ip) || 0;
  if (count >= limit) return false;
  limiter.set(ip, count + 1);
  return true;
}
