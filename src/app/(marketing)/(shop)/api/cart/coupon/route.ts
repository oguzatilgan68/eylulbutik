import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, code } = await req.json();

    // 1. Kuponu bul
    const coupon = await db.coupon.findUnique({ where: { code } });
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Kupon bulunamadı" });
    }

    // 2. Kupon geçerlilik kontrolü
    const now = new Date();
    if (!coupon.isActive) {
      return NextResponse.json({ success: false, message: "Bu kupon artık geçerli değil" });
    }

    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return NextResponse.json({ success: false, message: "Bu kupon henüz aktif değil" });
    }

    if (coupon.endsAt && new Date(coupon.endsAt) < now) {
      return NextResponse.json({ success: false, message: "Bu kuponun süresi dolmuş" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, message: "Bu kuponun kullanım limiti dolmuş" });
    }

    // 3. Kullanıcının sepetini bul
    const cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: "Sepetiniz boş" });
    }

    // 4. Sepet tutarını hesapla
    let subtotal = 0;
    for (const item of cart.items) {
      const price = Number(item.unitPrice);
      subtotal += price * item.qty;
    }

    // 5. İndirim tutarını hesapla
    let discount = 0;
    if (coupon.type === "PERCENT") {
      discount = subtotal * (Number(coupon.value) / 100);
    } else if (coupon.type === "FIXED") {
      discount = Number(coupon.value);
    }

    // İndirim ara toplamı aşmamalı
    if (discount > subtotal) {
      discount = subtotal;
    }

    // 6. Sepete kuponu kaydet
    await db.cart.update({
      where: { id: cart.id },
      data: { couponId: coupon.id },
    });

    return NextResponse.json({
      success: true,
      discount,
      couponCode: coupon.code,
      couponType: coupon.type,
      couponValue: Number(coupon.value),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Kupon uygulanamadı" });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    // Kullanıcının sepetinden kuponu kaldır
    const cart = await db.cart.findFirst({ where: { userId } });

    if (cart && cart.couponId) {
      await db.cart.update({
        where: { id: cart.id },
        data: { couponId: null },
      });
    }

    return NextResponse.json({ success: true, message: "Kupon kaldırıldı" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Kupon kaldırılamadı" });
  }
}
