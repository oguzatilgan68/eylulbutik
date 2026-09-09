import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

// GET /api/sliders
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const sliders = await db.slider.findMany({
      orderBy: { order: "asc" },
      include: { products: true },
    });
    return NextResponse.json(sliders);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Sliderlar alınamadı" }, { status: 500 });
  }
}

// POST /api/sliders
export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { title, subtitle, imageUrl, link, type, productId, order, isActive } =
      await req.json();

    const slider = await db.slider.create({
      data: {
        title,
        subtitle,
        imageUrl,
        link,
        type,
        order: order || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(slider);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message || "Slider oluşturulamadı" }, { status: 500 });
  }
}