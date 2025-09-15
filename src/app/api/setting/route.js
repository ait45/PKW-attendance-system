import { connectDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "config", "settings.json");
export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  console.log(req);
  if (!authHeader)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "คุณไม่ได้รับอนุญาต",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
  if (decoded.role !== "teacher" || !decoded.isAdmin)
    return NextResponse.json(null, { status: 403 });

  try {
    const data = fs.readFileSync(configPath, "utf-8");
    const settings = JSON.parse(data);
    return NextResponse.json({ data: settings }, { status: 200 });
  } catch (error) {
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
  const authHeader = req.headers.get("authorization");

  if (!authHeader)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "คุณไม่ได้รับอนุญาต",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
  if (decoded.role !== "teacher" || !decoded.isAdmin)
    return NextResponse.json(null, { status: 403 });
}
