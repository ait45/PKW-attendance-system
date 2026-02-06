import { NextRequest } from "next/server";

export function getIP(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown" ||
    "127.0.0.1"
  );
}