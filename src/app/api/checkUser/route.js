import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        await connectDB();
        const { username } = await req.json();
        const user = await User.findOne({ username }).select("_id");

        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
    }
}