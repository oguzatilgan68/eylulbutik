import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ reviews: [], stats: null });

    const reviews = await db.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
        user: { select: { fullName: true } },
      },
    });

    // Basit istatistik
    const ratingCount = reviews.length;
    const ratingAvg =
      ratingCount > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / ratingCount
        : 0;

    return NextResponse.json({ reviews, stats: { ratingAvg, ratingCount } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ reviews: [], stats: null });
  }
}
