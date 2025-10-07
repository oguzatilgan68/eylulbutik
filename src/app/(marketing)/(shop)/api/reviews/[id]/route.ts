import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

interface Params {
  id: string;
}

export async function GET(req: Request, props: { params: Promise<Params> }) {
  const params = await props.params;

  try {
    const { id } = params;
    if (!id) return NextResponse.json({ reviews: [], stats: null });

    const reviews = await db.review.findMany({
      where: { productId: id, isApproved: true }, // sadece onaylı
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        content: true,
        createdAt: true,
        user: { select: { fullName: true } },
      },
    });

    // isim ve soyisim baş harflerini üretelim
    const formattedReviews = reviews.map((review) => {
      const parts =
        review.user && review.user.fullName
          ? review.user.fullName.split(" ").filter(Boolean)
          : [];
      const fullName = parts.map((p) => p[0]?.toUpperCase() || "").join("");

      return {
        ...review,
        user: {
          ...review.user,
          fullName, // sadece baş harfler
        },
      };
    });

    const ratingCount = formattedReviews.length;
    const ratingAvg =
      ratingCount > 0
        ? formattedReviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

    return NextResponse.json({
      reviews: formattedReviews,
      stats: { ratingAvg, ratingCount },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reviews: [], stats: null });
  }
}
