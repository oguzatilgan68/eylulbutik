import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const skip = (page - 1) * pageSize;

    // Toplam ürün sayısı
    const totalCount = await db.product.count();

    // Sayfa sayısı
    const totalPages = Math.ceil(totalCount / pageSize);

    // Ürünleri çek
    const products = await db.product.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: { take: 1 },
      },
    });

    return NextResponse.json({
      items: products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Ürünler alınırken hata oluştu" },
      { status: 500 }
    );
  }
}
