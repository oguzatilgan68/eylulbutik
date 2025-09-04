import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId)
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );

    // Kullanıcının "default" wishlist'ini bul ya da oluştur
    let wishlist = await db.wishlist.findFirst({ where: { userId } });
    if (!wishlist) {
      wishlist = await db.wishlist.create({ data: { userId } });
    }

    // Ürün zaten ekli mi?
    const exists = await db.wishlist.findFirst({
      where: { id: wishlist.id, products: { some: { id: productId } } },
      select: { id: true },
    });

    if (exists) {
      await db.wishlist.update({
        where: { id: wishlist.id },
        data: { products: { disconnect: { id: productId } } },
      });
      return NextResponse.json({ ok: true, inWishlist: false });
    } else {
      await db.wishlist.update({
        where: { id: wishlist.id },
        data: { products: { connect: { id: productId } } },
      });
      return NextResponse.json({ ok: true, inWishlist: true });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
