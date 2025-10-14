// middleware.js

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { url } = req.nextUrl;

  // ยังไม่ login → ส่งไปหน้า login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isTeacher = token.name?.startsWith("T");
  if (url.pathname.startsWith("/teacher") && !isTeacher) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (url.pathname.startsWith("/dashboard" && isTeacher)) {
    return NextResponse.redirect(new URL("/teacher", req.url));
  }

  return NextResponse.next();
}
// ระบุ path ที่ให้ middleware ทำ
export const config = {
  matcher: ["/teacher/:path*", "/dashboard/:path*"],
};
