import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PoolConnection } from "mariadb/*";
import { MariaDBConnection } from "@/lib/config.mariaDB";

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const attendance_Table: string = process.env.MARIA_DB_TABLE_ATTENDANCE;

export async function GET(req: NextRequest, { params }) {
  const token = getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "คุณไม่ได้รับอนุญาต",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );

  const { id } = await params;
  let conn: PoolConnection;
  try {
    conn = await MariaDBConnection.getConnection();
    const query = `SELECT NAME, STATUS, CREATED_AT FROM ${attendance_Table} WHERE STUDENT_ID = ? AND DATE(CREATED_AT) = CURDATE()`;
    const data = conn.execute(query, [id]);
    if (!data) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json(
      {
        scuccess: true,
        payload: data,
        code: "SUCCESS",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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
