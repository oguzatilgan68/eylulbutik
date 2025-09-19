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
    const order = await db.order.findFirst({
      where: {
        userId: userId,
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
    const created = await db.review.create({
      data: {
        productId,
        userId,
        rating,
        title: title?.slice(0, 120) ?? null,
        content: content?.slice(0, 2000) ?? null,
        isApproved: false, // Moderasyona tabi
      },
    });

    // İsteğe bağlı: Product ratingAvg / ratingCount güncellemesini cron/moderation sonrası yapın.
    return NextResponse.json({ ok: true, review: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
