import { getToken } from "next-auth/jwt";
import LineupAttendanceModal from "../../../../../models/LineupAttendanceModal";

export async function PUT(req, { param }) {
  const token = getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse(
      {
        error: "Unauthorized",
        message: "คุณไม่ได้รับอนุญาต",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );
  }

  const { id } = await param;
  const { studentId, name, classes, status } = await req.json();
  const res = LineupAttendanceModal.findByIdAndUpdate(
    id,
    {
      studentId: studentId,
      name: name,
      classes: classes,
      status: status,
    },
    {
      new: true,
    }
  );
  if (res)
    return NextResponse.json(
      { success: true, message: "แก้ไขข้อมูลเสร็จสิ้น" },
      { status: 200 }
    );
  else return NextResponse.json({ success: false }, { status: 400 });
}
