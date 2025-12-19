import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { MariaDBConnection } from "@/lib/config.mariaDB";

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
  if (token.role !== "teacher")
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
        code: "FORBIDDEN",
      },
      { status: 403 }
    );

  try {
    const conn = await MariaDBConnection.getConnection();
    const query = `SELECT TEACHER_ID, NAME, DEPARTMENT, SUBJECT, PHONE, IS_ADMIN FROM ${process.env.MARIA_DB_TABLE_TEACHERS}`;

    const payload = await conn.query(query);
    conn.end();
    return NextResponse.json(
      { success: true, message: payload },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

export async function POST(req) {}
