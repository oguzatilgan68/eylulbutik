import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

interface Params {
  productId: string;
}

export async function GET(req: Request, props: { params: Promise<Params> }) {
  const params = await props.params;
  try {
    const { productId } = params;
    if (!productId) return NextResponse.json({ reviews: [], stats: null });

    const reviews = await db.review.findMany({
      where: { productId, isApproved: true }, // sadece onaylı
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

    const ratingCount = reviews.length;
    const ratingAvg =
      ratingCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

    return NextResponse.json({ reviews, stats: { ratingAvg, ratingCount } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reviews: [], stats: null });
  }
}
