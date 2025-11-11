import { NextResponse } from "next/server";
import { Holiday } from "../../../../scripts/Holiday";

export async function GET(req) {
  const today = new Date();
  const holiday = Holiday(today);
  return NextResponse.json(holiday, { status: 200 });
}
