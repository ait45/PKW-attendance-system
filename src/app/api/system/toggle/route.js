import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import path from "path";

const systemPath = path.join(process.cwd(), "config/system.json");

export async function GET() {
  const data = JSON.parse(fs.readFileSync(systemPath), "utf-8");
  return NextResponse.json(data);
}
export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "คุณไม่ได้รับอนุญาต",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );
  }

  const { main_active } = await req.json();
  console.log(main_active);
  fs.writeFileSync(systemPath, JSON.stringify({ main_active: main_active }, null, 2));
  return NextResponse.json({ ok: true, main_active });
}
