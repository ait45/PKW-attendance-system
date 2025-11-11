import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return NextResponse.json({ error: "No Token Found"}, { status: 401});
        return NextResponse.json({ token }, { status: 200});
    } catch (error) {
        console.error("Error geting token: ", error);
        return NextResponse.json({ error: "Failed to Get Token"}, { status: 500 });
    }
    
}