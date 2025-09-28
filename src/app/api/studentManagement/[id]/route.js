import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import { getToken } from "next-auth/jwt";

export async function DELETE(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthorization" },
      { status: 401 }
    );
  try {
    const { id } = await params;
    await connectDB();
    await Student.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthorization" },
      { status: 401 }
    );
  try {
    await connectDB();
    const body = await req.json();
    const update = { ...body };
    const { id } = await params;
    const res = await Student.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (res)
      return NextResponse.json(
        { success: true, message: "แก้ไขข้อมูลเสร็จสิ้น" },
        { status: 200 }
      );
    else return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
export async function GET(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthorization" },
      { status: 401 }
    );
  try {
    await connectDB();
    const { id } = await params;
    const res = await Student.findById(id);
    const data = {
      studentId: res.studentId,
      name: res.name,
      classes: res.classes,
      phone: res.phone,
      parentPhone: res.parentPhone,
      status: res.status,
      plantData: res.plantData,
      Number: res.Number,
      comeDays: res.comeDays,
      lateDays: res.lateDays,
      leaveDays: res.leaveDays,
      absentDays: res.absentDays,
      behaviorScore: res.behaviorScore,
      status: res.status,
      isAdmin: res.isAdmin,
    };
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
