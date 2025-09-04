import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, code } = await req.json();

    // Basit örnek: kupon kontrol
    const coupon = await db.coupon.findUnique({ where: { code } });
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Kupon bulunamadı" });
    }

    // Sepete uygula (örnek)
    return NextResponse.json({
      success: true,
      discount: coupon.value,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Kupon uygulanamadı" });
  }
}
