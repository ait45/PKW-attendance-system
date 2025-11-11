import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import Teacher from "../../../../models/Teacher";
import { connectDB } from "../../../../lib/mongodb";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
if (!token.role === "teacher") return NextResponse.json({ success: false, error: "Forbidden"}, {status: 403})

  try {
    await connectDB();
    const response = await Teacher.find({});

    const payload = response.map((index) => {
        return {
            teacherId: index.teacherId,
            name: index.name,
        }
    })


  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(req) {}
