import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { productId, variantId, qty = 1 } = await req.json();
    if (!productId || qty < 1)
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });

    // Kullanıcının aktif sepeti (en son oluşturulan)
    let cart = await db.cart.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (!cart) cart = await db.cart.create({ data: { userId } });

    // Ürünü ve varsa varyantlarını veritabanından çekelim
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product)
      return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });

    let unitPrice: number | undefined = undefined;

    // 1. Eğer bir varyant seçilmişse, o varyantın fiyatını bulmaya çalışalım
    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant && variant.price !== null) {
        unitPrice = Number(variant.price);
      }
    }

    // 2. Varyant fiyatı bulunamadıysa (veya varyant yoksa) ana ürün fiyatına bakalım
    if (unitPrice === undefined && product.price !== null) {
      unitPrice = Number(product.price);
    }

    // Hala fiyat bulunamadıysa hata dön
    if (unitPrice === undefined || isNaN(unitPrice)) {
      return NextResponse.json({ error: "PRICE_MISSING" }, { status: 400 });
    }

    // Aynı ürün (veya aynı varyant) sepette ekliyse miktarını (qty) arttır
    const existing = await db.cartItem.findFirst({
      where: { 
        cartId: cart.id, 
        productId, 
        variantId: variantId ?? null 
      },
    });

    if (existing) {
      const updated = await db.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + qty },
      });
      return NextResponse.json({ ok: true, cartItem: updated });
    }

    // Yeni sepet kalemi oluştur
    const created = await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId ?? null,
        qty,
        unitPrice,
      },
    });

    return NextResponse.json({ ok: true, cartItem: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}