import { NextResponse, NextRequest } from "next/server";
import { MongoDBConnection } from "@/lib/config.mongoDB.ts";
import Student from "@/models/Mongo.model.Student.ts";
import { auth } from "@/lib/auth.ts";

type RouteParams = {
  params: Promise<{ id: string }>;
};

interface Student {
  studentId: string;
  name: string;
  classes: string;
  phone: string;
  parentPhone: string;
  joinDays: number;
  leaveDays: number;
  lateDays: number;
  absentDays: number;
  behaviorScore: number;
  status: string;
  plantData: string;
  Number: number;
  isAdmin: boolean;
}
export async function DELETE(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const session = await auth();
  if (!session)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "ต้องยืนยันตัวตนก่อนใช้งาน",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );
  try {
    const { id } = await params;
    await MongoDBConnection();
    await Student.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "ลบข้อมูลเสร็จสิ้น", code: "SUCCESS" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error to Delete Data", error);
    return NextResponse.json({ error: "internal_server_error", message: error, code: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const session = await auth();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized", message: "ต้องยืนยันตัวตนก่อนใช้งาน", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  try {
    await MongoDBConnection();
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
      { error: "internal_server_error", message: error, code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const session = await auth();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized", message: "ต้องยืนยันตัวตนก่อนใช้งาน", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  try {
    await MongoDBConnection();
    const { id } = await params;
    const res = await Student.findById(id);
    if (!res)
      return NextResponse.json(
        { error: "not_found", message: "ไม่พบข้อมูลนักเรียน", code: "NOT_FOUND" },
        { status: 404 }
      );
    const data = {
      studentId: res.studentId,
      name: res.name,
      classes: res.classes,
      phone: res.phone,
      parentPhone: res.parentPhone || null,
      status: res.status,
      plantData: res.plantData,
      Number: res.Number,
      joinDays: res.joinDays,
      lateDays: res.lateDays,
      leaveDays: res.leaveDays,
      absentDays: res.absentDays,
      behaviorScore: res.behaviorScore,
      isAdmin: res.isAdmin,
    };
    return NextResponse.json({ success: true, message: "ดึงข้อมูลเสร็จสิ้น", data: data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal_server_error", message: error, code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
