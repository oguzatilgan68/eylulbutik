import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db"; 

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      include: {
        children: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Kategoriler yüklenemedi" },
      { status: 500 }
    );
  }
}