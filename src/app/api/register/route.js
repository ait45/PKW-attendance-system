import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { username, password, role } = req.json();
        const hashPassword = await bcrypt.hash(password, 10);

        await connectDB();
        await User.create({ username, password: hashPassword, role });
        
        return NextResponse.json({ message: "user registing successfully."}, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occured while registrasing the user. "}, { status: 500 });

    }
}