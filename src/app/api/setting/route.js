import { NextResponse } from "next/server";
import readConfig from "../../../scripts/readConfig";
import { getToken } from "next-auth/jwt";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "ต้องยืนยันตัวตนก่อนใช้งาน",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );
  try {
    const settings = await readConfig();
    return NextResponse.json({ data: settings }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
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
  if (token.role !== "teacher" && !token.isAdmin)
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้",
        code: "FORBIDDEN",
      },
      { status: 403 }
    );

  try {
    const data = await req.json();

    const filePath = path.join(process.cwd(), "config", "settings.json");
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
