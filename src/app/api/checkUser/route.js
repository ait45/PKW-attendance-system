import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/Student";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        await connectDB();
        const { studentId } = await req.json();
        const user = await User.findOne({ studentId }).select("_id");

        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
    }
}