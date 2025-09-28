import { autoCutoff } from "../../../../scripts/checkCutoff";
import { NextResponse } from "next/server";

export async function GET(req) {
  const res = await autoCutoff();
  return NextResponse.json({ res }, { status: 200 });
}
