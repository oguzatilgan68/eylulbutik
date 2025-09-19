import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json([], { status: 401 });

  const reviews = await db.review.findMany({
    where: { userId: userId },
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          images: { select: { url: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}
