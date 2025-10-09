import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    if (search.length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    // 🔍 Arama işlemi
    const products = await db.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive", // büyük-küçük harf duyarsız arama
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 10, // sadece ilk 10 sonuç
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
