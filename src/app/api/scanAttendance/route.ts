import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { cutoff, attendanceStart } from "@/scripts/checkCutoff.ts";
import { update_behaviorScore } from "@/scripts/behaviorScore-deduction.ts";
import { MariaDBConnection } from "@/lib/config.mariaDB.ts";
import { PoolConnection } from "mariadb/*";
import { JWT } from "next-auth/jwt";

const now = new Date();
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const attendance_Table: string = process.env.MARIA_DB_TABLE_ATTENDANCE;
const students_Table: string = process.env.MARIA_DB_TABLE_STUDENTS;
export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  if (!token)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "ต้องยืนยันตัวตนก่อนใช้งาน",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );
  if (token?.user?.isAdmin === false)
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้",
        code: "FORBIDDEN",
      },
      { status: 403 }
    );
  let conn: PoolConnection;
  try {
    if (attendanceStart) {
      const post = await req.json();

      conn = await MariaDBConnection.getConnection();
      const status = await cutoff();

      const query: string = `INSERT INTO ${attendance_Table} (HANDLER, STUDENT_ID, NAME, CLASSES, STATUS) SELECT ?, STUDENT_ID, NAME, CLASSES, ? FROM ${students_Table} WHERE STUDENT_ID = ?`;
      const result = await conn.execute(query, [post.handler, status, post.id]);
      if (result.affectedRows === 0) {
        return NextResponse.json(
          {
            error: "Not Found",
            message: "ไม่พบรหัสนักเรียนในระบบ",
            code: "NOT_FOUND",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: "เช็คชื่อสำเร็จ",
          code: "SUCCESS",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error.errno === 1062) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "วันนี้ได้ทำการเช็คชื่อไปแล้ว",
          code: "CONFLICT",
        },
        { status: 409 }
      );
    }
  } finally {
    if (conn) conn.end();
  }
}

export async function GET(req: NextRequest) {
  const token: JWT = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
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
  let conn: PoolConnection;
  try {
    conn = await MariaDBConnection.getConnection();
    const query: string = `SELECT * FROM ${attendance_Table} WHERE CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC`;
    const data = await conn.query(query, [startOfDay, endOfDay]);
    if (data.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    const payload = data.map(
      (index: {
        HANDLER: string;
        STUDENT_ID: string;
        NAME: string;
        CLASSES: string;
        STATUS: string;
        CREATED_AT: Date;
      }) => {
        return {
          handler: index.HANDLER,
          studentId: index.STUDENT_ID,
          name: index.NAME,
          classes: index.CLASSES,
          status: index.STATUS,
          createdAt: index.CREATED_AT,
        };
      }
    );
    return NextResponse.json(
      { success: true, message: payload },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
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
export async function PUT(req: NextRequest) {
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

  const list = await req.json();
  if (!Array.isArray(list)) {
    return NextResponse.json(
      { error: "Data must be an array", message: "Data ต้องเป็น list" },
      { status: 400 }
    );
  }
  try {
    await update_behaviorScore(list);
    return NextResponse.json(
      { success: true, message: "แก้ไขข้อมูลเสร็จสิ้น", code: "SUCCESS" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Bad Request",
        message: error,
        code: "BAD_REQUEST",
      },
      { status: 400 }
    );
  }
}
