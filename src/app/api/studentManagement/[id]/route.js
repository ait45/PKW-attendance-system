import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";

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
