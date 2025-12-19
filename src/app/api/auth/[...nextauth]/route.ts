import { NextRequest } from "next/server";
import { AuthOptions } from "@/lib/auth-config.ts";
import { limiter } from "@/lib/ratelimit.ts";
import NextAuth from "next-auth";

interface RouteContext {
  params: Promise<{ nextauth: string[] }>;
}

// จำกัดการเข้าสู่ระบบ ภายใน 1 นาที
function checkRatelimit(ip: string) {
  const count: number = limiter.get(ip) || 0;
  if (count >= 5) return false;
  limiter.set(ip, count + 1);
  return true;
}
const handler = NextAuth(AuthOptions);
export { handler as GET };
export async function POST(req: NextRequest, context: RouteContext) {
  const ip =
    req.headers?.get?.("x-forwarded-for")?.split(",")[0] ||
    req.headers?.get?.("x-real-ip") ||
    "127.0.0.1";
  if (!checkRatelimit(ip)) {
    return new Response(JSON.stringify({ error: "Too Many requests" }), {
      status: 429,
    });
  }
  return handler(req, context);
}
