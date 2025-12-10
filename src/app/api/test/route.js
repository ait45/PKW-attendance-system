import { NextResponse } from "next/server";
import { MariaDBConnection } from "../../../../lib/config.mariaDB";

export async function GET(request) {
  try {
    const conn = await MariaDBConnection.getConnection();
    const rows = await conn.query("SELECT * FROM data_students_pkw");
    conn.end();
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
