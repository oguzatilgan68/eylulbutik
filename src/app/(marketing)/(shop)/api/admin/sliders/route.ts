import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/sliders
export async function GET(req: NextRequest) {
  const sliders = await db.slider.findMany({
    orderBy: { order: "asc" },
    include: { products: true },
  });
  return NextResponse.json(sliders);
}

// POST /api/sliders
export async function POST(req: Request) {
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
}

// PATCH /api/sliders/:id
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = (await context.params);

  const { title, subtitle, imageUrl, link, type, order, isActive } =
    await request.json();

  const updatedSlider = await db.slider.update({
    where: { id },
    data: {
      title,
      subtitle,
      imageUrl,
      link,
      type,
      order,
      isActive,
    },
  });

  return NextResponse.json(updatedSlider);
}
// DELETE /api/sliders/:id
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await db.slider.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
