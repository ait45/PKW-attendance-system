export const runtime = "nodejs";

import { MongoDBConnection } from "@/lib/config.mongoDB.ts";
import { MariaDBConnection } from "@/lib/config.mariaDB.ts";
import { NextRequest, NextResponse } from "next/server";
import Student from "@/models/Mongo.model.Student.ts";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";
import bcrypt from "bcrypt";

const TABLE_STUDENTS = process.env.MARIA_DB_TABLE_STUDENTS;

interface Data {
  _id: string;
  STUDENT_ID: string;
  NAME: string;
  CLASSES: string;
  PHONE: string;
  PARENT_PHONE: string;
  STATUS: string;
  PLANT_PASSWORD: string;
  NUMBER: string;
  JOIN_DAYS: string;
  LEAVE_DAYS: string;
  LATE_DAYS: string;
  ABSENT_DAYS: string;
  BEHAVIOR_SCORE: string;
  IS_ADMIN: number;
}

// generatePassword
async function genPassword(size: number) {
  const number = "1234567890";
  let password = "PKW_";

  const bytes = crypto.randomBytes(size);
  for (let i = 0; i < size; i++) {
    password += number[bytes[i] % number.length];
  }
  return password;
}
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log(token);
  if (!token)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "ต้องยืนยันตัวตนก่อนใช้งาน",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );

  try {
    const conn = await MariaDBConnection.getConnection();
    const query = `SELECT * FROM ${TABLE_STUDENTS}`;
    const data = await conn.query(query);
    conn.end();

    if (token?.role === "teacher" && token?.isAdmin) {
      const payload = data.map((index: Data) => {
        return {
          _id: index._id,
          studentId: index.STUDENT_ID,
          name: index.NAME,
          classes: index.CLASSES,
          phone: index.PHONE,
          parentPhone: index.PARENT_PHONE,
          status: index.STATUS || null,
          plantData: index.PLANT_PASSWORD,
          Number: index.NUMBER,
          joinDays: index.JOIN_DAYS,
          leaveDays: index.LEAVE_DAYS,
          lateDays: index.LATE_DAYS,
          absentDays: index.ABSENT_DAYS,
          behaviorScore: index.BEHAVIOR_SCORE,
          isAdmin: index.IS_ADMIN === 1 ? true : false,
        };
      });
      return NextResponse.json(
        { success: true, payload: payload },
        { status: 200 }
      );
    } else if (token?.role === "teacher" && !token?.isAdmin) {
      const payload = data.map((index: Data) => {
        return {
          id: index._id,
          studentId: index.STUDENT_ID,
          name: index.NAME,
          classes: index.CLASSES,
          phone: index.PHONE,
          parentPhone: index.PARENT_PHONE,
          status: index.STATUS || null,
          Number: index.NUMBER,
          comeDays: index.JOIN_DAYS,
          leaveDays: index.LEAVE_DAYS,
          lateDays: index.LATE_DAYS,
          absentDays: index.ABSENT_DAYS,
          behaviorScore: index.BEHAVIOR_SCORE,
          isAdmin: index.IS_ADMIN === 1 ? true : false,
        };
      });
      return NextResponse.json(
        { success: true, payload: payload },
        { status: 200 }
      );
    }
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
    return NextResponse.json({ error: "Unauthrization" }, { status: 401 });
  try {
    const { studentId, name, classes, phone, parentPhone, Number } =
      await req.json();
    const plantData = await genPassword(5);
    const password = await bcrypt.hash(plantData, 10);

    const conn = await MariaDBConnection.getConnection();
    const query = `INSERT INTO ${TABLE_STUDENTS} (STUDENT_ID, NAME, CLASSES, PHONE, PARENT_PHONE, PLANT_PASSWORD, NUMBER) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await conn.execute(query, [
      studentId,
      name,
      classes,
      phone,
      parentPhone,
      plantData,
      Number,
    ]);
    conn.end();
    await MongoDBConnection();
    await Student.create({
      studentId: studentId,
      name: name,
      password: password,
    });

    return NextResponse.json(
      { success: true, message: "เพิ่มข้อมูลเสร็จสิ้น" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error :", error);
    if (error.code === "ER_DUP_ENTRY") {
      const message = error.sqlMessage || error.message;
      if (message.includes("STUDENT_ID")) {
        return NextResponse.json(
          {
            success: false,
            message: { studentId: "มีข้อมูลในระบบแล้ว" },
          },
          { status: 409 }
        );
      }
      if (message.includes("unique_class_number")) {
        return NextResponse.json(
          {
            success: false,
            message: { Number: "เลขที่มีข้อมูลในระบบแล้ว" },
          },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
