import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sliders = await db.slider.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { products: true }, // ürün bilgisi gerekirse
    });

    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json({ error: "Sliders alınamadı" }, { status: 500 });
  }
}
