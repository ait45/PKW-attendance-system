import { connectDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import LineupAttendanceModal from "../../../../models/LineupAttendanceModal";
import Student from "../../../../models/Student";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import jwt, { decode } from "jsonwebtoken";

export async function POST(req) {
  const token = getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthrization" },
      { status: 401 }
    );
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  try {
    const post = await req.json();
    await connectDB();
    const data = await Student.findOne({ studentId: post.id });
    if (data) {
      const { studentId, name, classes } = data;
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
        classes,
      });
      await doc.save();
      return NextResponse.json(
        { success: true, data: "success" },
        { status: 201 }
      );
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

export async function GET(req) {
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
  if (token.role !== "teacher" || !token.isAdmin) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้",
        code: "FORBIDDEN",
      },
      { status: 403 }
    );
  }
  try {
    await connectDB();

    const data = await LineupAttendanceModal.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).limit(200);
    if (data.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    const payload = data.map((index) => {
      return {
        studentId: index.studentId,
        name: index.name,
        classes: index.classes,
        createdAt: index.createdAt,
      };
    });
    return NextResponse.json(
      { success: true, message: payload },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to Request!" },
      { status: 403 }
    );
  }
}
