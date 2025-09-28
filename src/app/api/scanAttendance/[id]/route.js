import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import LineupAttendanceModal from "../../../../../models/LineupAttendanceModal";

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

export async function GET(req, { params }) {
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
  try {
    const res = await LineupAttendanceModal.findOne({
      studentId: id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    if (!res) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to Request!" },
      { status: 500 }
    );
  }
}
