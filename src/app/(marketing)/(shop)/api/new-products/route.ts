import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        images: {
          select: { url: true }, // tüm görsellerin url'leri
        },
      },
      where: { status: "PUBLISHED", inStock: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Her ürün için sadece ilk görseli al
    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.images[0]?.url || null, // ilk görsel veya null
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    return NextResponse.json({ error: "Ürünler alınamadı" }, { status: 500 });
  }
}
