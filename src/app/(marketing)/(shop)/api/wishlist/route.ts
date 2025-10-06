import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { serializeProduct } from "@/app/(marketing)/lib/serializers";

export async function GET() {
  const userId = await getAuthUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlist = await db.wishlist.findFirst({
    where: { userId },
    include: { products: { include: { images: true, brand: true } } },
  });

  if (!wishlist || wishlist.products.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = wishlist.products.map(serializeProduct);

  return NextResponse.json({ products, userId });
}
