import { auth } from "@/lib/auth.ts";
import { NextRequest, NextResponse } from "next/server";
import { MongoDBConnection } from "@/lib/config.mongoDB.ts";
import LineUser from "@/models/Mongo.model.LineUser.ts";

// GET - ดึงรายการ LINE users ทั้งหมด
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const isActive = searchParams.get("isActive");

  try {
    await MongoDBConnection();

    const query: Record<string, unknown> = {};
    if (role && role !== "all") {
      query.role = role;
    }
    if (isActive !== null && isActive !== "all") {
      query.isActive = isActive === "true";
    }

    const users = await LineUser.find(query).sort({ createdAt: -1 }).lean();

    // Get stats
    const stats = await LineUser.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalActive = await LineUser.countDocuments({ isActive: true });
    const totalInactive = await LineUser.countDocuments({ isActive: false });

    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          stats: {
            byRole: stats,
            active: totalActive,
            inactive: totalInactive,
            total: users.length,
          },
        },
        code: "SUCCESS",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error,
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}

// POST - เพิ่ม LINE user ใหม่
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "teacher") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, displayName, role, note } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Bad Request", message: "userId is required" },
        { status: 400 },
      );
    }

    await MongoDBConnection();

    // Check if userId already exists
    const existing = await LineUser.findOne({ userId });
    if (existing) {
      return NextResponse.json(
        { error: "Bad Request", message: "userId นี้มีอยู่แล้ว" },
        { status: 400 },
      );
    }

    const newUser = await LineUser.create({
      userId,
      displayName: displayName || "",
      role: role || "other",
      note: note || "",
      addedBy: session.user.name || "Unknown",
    });

    return NextResponse.json(
      { success: true, message: "เพิ่ม LINE User สำเร็จ", data: newUser },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error,
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}

// PUT - แก้ไข LINE user
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "teacher") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, displayName, role, note, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Bad Request", message: "id is required" },
        { status: 400 },
      );
    }

    await MongoDBConnection();

    await LineUser.findByIdAndUpdate(id, {
      displayName,
      role,
      note,
      isActive,
    });

    return NextResponse.json(
      { success: true, message: "แก้ไข LINE User สำเร็จ" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error,
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}

// DELETE - ลบ LINE user
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "teacher") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Bad Request", message: "id is required" },
      { status: 400 },
    );
  }

  try {
    await MongoDBConnection();
    await LineUser.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "ลบ LINE User สำเร็จ" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error,
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
