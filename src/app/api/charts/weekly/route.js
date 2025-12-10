import { NextResponse } from "next/server";
import { MongoDBConnection } from "../../../../../lib/config.mongoDB";
import LineupAttendanceModal from "../../../../../models/LineupAttendanceModal";
import { startOfWeek, endOfWeek } from "date-fns";
import { getToken } from "next-auth/jwt";

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
  await MongoDBConnection();

  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const data = await LineupAttendanceModal.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        present: {
          $sum: {
            $cond: [{ $eq: ["$status", "เข้าร่วมกิจกรรม"] }, 1, 0],
          },
        },
        leave: {
          $sum: {
            $cond: [{ $eq: ["$status", "ลา"] }, 1, 0],
          },
        },
        late: {
          $sum: {
            $cond: [{ $eq: ["$status", "สาย"] }, 1, 0],
          },
        },
        absent: {
          $sum: {
            $cond: [{ $eq: ["$status", "ขาด"] }, 1, 0],
          },
        },
      },
    },
  ]);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weeklyData = days.map((day, i) => {
    const d = data.find((x) => x._id === i + 2);
    return {
      day,
      present: d ? d.present : 0,
      leave: d ? d.leave : 0,
      late: d ? d.late : 0,
      absent: d ? d.absent : 0,
    };
  });
  return NextResponse.json(
    {
      data: weeklyData,
    },
    { status: 200 }
  );
}
