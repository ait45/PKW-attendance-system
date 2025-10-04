import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import LineupAttendanceModal from "../../../../../models/LineupAttendanceModal";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET(req) {
  await connectDB();

  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const data = await LineupAttendanceModal.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: "เข้าร่วมกิจกรรม",
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        count: { $sum: 1 },
      },
    },
  ]);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weeklyData = days.map((day, i) => {
    const d = data.find((x) => x._id === i + 2);
    return { day, count: d ? d.count : 0 };
  });
  return NextResponse.json(
    {
      data: weeklyData,
    },
    { status: 200 }
  );
}
