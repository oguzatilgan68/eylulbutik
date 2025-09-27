import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.user.findMany({
      where: {
        role: "CUSTOMER",
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({
      where: {
        role: "CUSTOMER",
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return NextResponse.json({ users, total });
}

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: "User ID gerekli" }, { status: 400 });

  await db.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
