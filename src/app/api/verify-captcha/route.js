import { NextResponse } from "next/server";

export async function POST(req) {
    const { captchaToken } = await req.json();

    const res = await fetch("https://api.hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `response=${captchaToken}%secret=${process.env.HCAPTCHA_SECRET}`,
    });

    const data = await res.json();
    return NextResponse.json({ success: data.success });
}