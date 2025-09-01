import { connectDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import LineupAttendanceModal from "../../../../models/LineupAttendanceModal";
import Student from "../../../../models/Student";

export async function POST(req) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  try {
    const post = await req.json();
    await connectDB();
    const data = await Student.findOne({ studentId: post.id });
    if (data) {
      const { studentId, name, Class, grade } = data;
      const existing = await LineupAttendanceModal.findOne({
        studentId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "วันนี้นักเรียนคนนี้ได้ทำการเช็คชื่อไปแล้ว",
          },
          { status: 400 }
        );
      }
      const doc = await LineupAttendanceModal.create({
        studentId,
        name,
        Class,
        grade,
      });
      await doc.save();
      return NextResponse.json({ success: true, data: "success" });
    }
    return NextResponse.json(
      { success: false, message: "ไม่มีข้อมูลนักเรียน!" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 501 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const data = await Student.findOne({});

    const payload = {
      name: data.name,
      Class: data.Class,
      grade: data.grade,
    }

    if (data) {
      return NextResponse.json(
        { success: true, message: payload },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "no data" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to Request!" },
      { status: 503 }
    );
  }
}
