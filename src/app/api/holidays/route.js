import { NextResponse } from "next/server";
import { Holiday } from "../../../../scripts/Holiday";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "คุณไม่ได้รับอนุญาต",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );
  const today = new Date();
  const holiday = Holiday(today);
  return NextResponse.json(holiday, { status: 200 });
}
