import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, orderTotal } = body;

  if (!code)
    return NextResponse.json(
      { error: "Kupon Kodu Bulunamadı" },
      { status: 400 }
    );
  const coupon = await db.coupon.findUnique({
    where: { code: String(code).toUpperCase() },
  });
  if (!coupon)
    return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });

  // Active
  const now = new Date();
  if (!coupon.isActive)
    return NextResponse.json({ error: "Kupon pasif" }, { status: 400 });
  if (coupon.startsAt && coupon.startsAt > now)
    return NextResponse.json(
      { error: "Kupon henüz geçerli değil" },
      { status: 400 }
    );
  if (coupon.endsAt && coupon.endsAt < now)
    return NextResponse.json({ error: "Kupon süresi dolmuş" }, { status: 400 });
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
    return NextResponse.json(
      { error: "Kupon kullanım limiti dolmuş" },
      { status: 400 }
    );

  // Calculate discount
  const total = Number(orderTotal ?? 0);
  let discount = 0;
  if (coupon.type === "PERCENT") {
    discount = (Number(coupon.value) * total) / 100;
  } else {
    discount = Number(coupon.value);
  }

  const final = Math.max(0, total - discount);

  // Optionally increment usedCount (should be done on successful order completion in many cases)
  // We'll return the computed data and let the order creation flow increment usedCount atomically.

  return NextResponse.json({
    data: { couponId: coupon.id, code: coupon.code, discount, final },
  });
}
