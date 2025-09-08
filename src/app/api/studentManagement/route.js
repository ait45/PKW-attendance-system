import { connectDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Student from "../../../../models/Student";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";
import { encrypt } from "../../../../lib/crypto";
import { decrypt } from "../../../../lib/crypto";
// helper mask
function maskCard(card) {
  if (!card) return "";
  // แสดงแค่ 6 ตัวแรกและ 2 ตัวสุดท้าย ตัวกลางเป็น *
  const start = card.slice(0, 6);
  const end = card.slice(-2);
  const maskedMiddle = "*".repeat(
    Math.max(0, card.length - start.length - end.length)
  );
  return `${start}${maskedMiddle}${end}`;
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
    let decrypted = null;

    const payload = data.map((index) => {
      try {
        decrypted = index.cardId ? decrypt(index.cardId) : null;
      } catch (err) {
        decrypted = null;
      }
      return {
        id: index._id,
        studentId: index.studentId,
        name: index.name,
        cardId: decrypted ? maskCard(decrypted) : null,
        classes: index.Class,
        phone: index.phone,
        parentPhone: index.parentPhone,
        address: index.address,
        status: index.status,
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
  console.log(req);
  try {
    const body = await req.json();
    const { studentId, name, password, Class, phone, parentPhone, address } =
      body;
    const hashPassword = await bcrypt.hash(password, 10);
    const cardIdHash = await password ? encrypt(password) : undefined;
    console.log(cardIdHash);
    const checkId = await Student.findOne({ studentId: studentId });
    if (checkId)
      return NextResponse.json(
        { success: false, message: "มีข้อมูลในระบบแล้ว" },
        { status: 405 }
      );
    else {
      const doc = await Student.create({
        studentId,
        name,
        password: hashPassword,
        Class,
        phone,
        parentPhone,
        address,
        cardId: cardIdHash,
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
