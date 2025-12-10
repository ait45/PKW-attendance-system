// import โมดูลที่จำเป็นต้องใช้งาน -------------

import fs from "fs";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import path from "path";

const departmentPath = path.join(process.cwd(), "config", "department.json");

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
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
    const file = JSON.parse(fs.readFileSync(departmentPath, "utf-8"));
    return NextResponse.json(
      { success: true, message: file, code: "SUCCESSFULLY" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error,
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
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
    const body = await req.json();
    if (!body)
      return NextResponse.json(
        {
          error: "Parameter Not Found",
          message: "ไม่มีข้อมูลที่ส่งมา",
          code: "PARAMETER_NOT_FOUND",
        },
        { status: 422 }
      );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error,
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
