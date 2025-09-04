import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing userId or productId" },
        { status: 400 }
      );
    }

    // 1️⃣ Önce wishlist’i bul
    const wishlist = await db.wishlist.findFirst({
      where: { userId },
    });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist bulunamadı" },
        { status: 404 }
      );
    }

    // 2️⃣ Ürünü disconnect et
    await db.wishlist.update({
      where: { id: wishlist.id }, // 👈 burada artık unique id kullanıyoruz
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
