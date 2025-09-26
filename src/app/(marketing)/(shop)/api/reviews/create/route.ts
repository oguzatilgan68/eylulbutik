import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { productId, rating, title, content } = await req.json();
    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    // Kullanıcının ürünü sipariş edip teslim aldığını kontrol et
    const order = await db.order.findFirst({
      where: {
        userId,
        items: { some: { productId } },
        shipment: { status: "DELIVERED" },
      },
      include: { shipment: true },
    });
    if (!order) {
      return NextResponse.json(
        {
          error:
            "Bu ürün için yorum yapma yetkiniz yok. Siparişiniz teslim edilmemiş görünüyor.",
        },
        { status: 403 }
      );
    }

    // Review oluştur
    const created = await db.review.create({
      data: {
        productId,
        userId,
        rating,
        content: content?.slice(0, 2000) ?? null,
        isApproved: false, // İster moderasyona tabi bırakabilirsin
      },
    });

    // Product ratingAvg ve ratingCount güncelle
    const agg = await db.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await db.product.update({
      where: { id: productId },
      data: {
        ratingAvg: agg._avg.rating || 0,
        ratingCount: agg._count.rating,
      },
    });

    return NextResponse.json({ ok: true, review: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
