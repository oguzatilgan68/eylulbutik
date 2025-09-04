import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ inWishlist: false });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ inWishlist: false });

    const exists = await db.wishlist.findFirst({
      where: { userId, products: { some: { id: productId } } },
      select: { id: true },
    });

    return NextResponse.json({ inWishlist: Boolean(exists) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ inWishlist: false });
  }
}
