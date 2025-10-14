import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.genericData.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /generic-data error:", error);
    return NextResponse.json(
      { error: "Veriler alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
