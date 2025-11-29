import { NextResponse } from "next/server";
import { MariaDBConnection } from "../../../../lib/mariadb";

export async function GET(request) {
  try {
    const [rows] = await MariaDBConnection.query(
      "SELECT * FROM data_students_pkw"
    );
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
