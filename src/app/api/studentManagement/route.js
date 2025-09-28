import { connectDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Student from "../../../../models/Student";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";
import bcrypt from "bcrypt";

// generatePassword
async function genPassword(lenght) {
  const number = "1234567890";
  let password = "PKW_";

  const bytes = crypto.randomBytes(lenght);
  for (let i = 0; i < lenght; i++) {
    password += number[bytes[i] % number.length];
  }
  return password;
}
export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorization" },
      { status: 401 }
    );
  }
  try {
    await connectDB();
    const data = await Student.find({}).limit(200);

    if (token?.role === "teacher" && token?.isAdmin) {
      const payload = data.map((index) => {
        return {
          _id: index._id,
          studentId: index.studentId,
          name: index.name,
          classes: index.classes,
          phone: index.phone,
          parentPhone: index.parentPhone,
          status: index.status,
          plantData: index.plantData,
          Number: index.Number,
        };
      });
      return NextResponse.json(
        { success: true, message: payload },
        { status: 200 }
      );
    }
    const payload = data.map((index) => {
      return {
        id: index._id,
        studentId: index.studentId,
        name: index.name,
        classes: index.classes,
        phone: index.phone,
        parentPhone: index.parentPhone,
        status: index.status,
        Number: index.Number,
      };
    });
    return NextResponse.json(
      { success: true, message: payload },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 501 }
    );
  }
}

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthorization" },
      { status: 401 }
    );
  try {
    const body = await req.json();
    const { studentId, name, classes, phone, parentPhone, Number } = body;
    const plantData = await genPassword(5);
    const password = await bcrypt.hash(plantData, 10);
    const checkId = await Student.findOne({ studentId: studentId });
    if (checkId)
      return NextResponse.json(
        { success: false, message: { studentId: "มีข้อมูลในระบบแล้ว" } },
        { status: 400 }
      );
    else {
      const doc = await Student.create({
        studentId,
        name,
        password,
        classes,
        phone,
        parentPhone,
        plantData,
        Number,
      });
      console.log(doc);
      await doc.save();
      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
