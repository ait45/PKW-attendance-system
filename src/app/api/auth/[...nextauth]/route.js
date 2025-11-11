import { handlers } from "../../../../../lib/auth";
import { limiter } from "../../../../../lib/ratelimit";
// จำกัดการเข้าสู่ระบบ ภายใน 1 นาที 
function checkRatelimit(ip) {
  const count = limiter.get(ip) || 0;
  if (count >= 5) return false;
  limiter.set(ip, count + 1);
  return true;
}
export { handlers as GET };
export async function POST(req, res) {
  const ip =
    req.headers?.get?.("x-forwarded-for")?.split(",")[0] ||
    req.headers?.get?.("x-real-ip") ||
    "127.0.0.1";
  if (!checkRatelimit(ip)) {
    return new Response(JSON.stringify({ error: "Too Many requests" }), {
      status: 429,
    });
  }
  return handlers(req, res);
}
