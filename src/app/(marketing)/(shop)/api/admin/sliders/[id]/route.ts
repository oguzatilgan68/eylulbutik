import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

// Dinamik ID parametresi al
interface Params {
  params: { id: string };
}

// GET /api/admin/sliders/:id
export async function GET(req: Request, { params }: Params) {
  try {
    const slider = await db.slider.findUnique({
      where: { id: params.id },
      include: { products: true }, // ilişkili ürünleri getir
    });

    if (!slider)
      return NextResponse.json({ error: "Slider bulunamadı" }, { status: 404 });

    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json(
      { error: "Slider alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/sliders/:id
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      link,
      type,
      productIds,
      order,
      isActive,
      imageUrl,
    } = body;

    // Slider güncelle
    const updatedSlider = await db.slider.update({
      where: { id: params.id },
      data: {
        title,
        subtitle,
        link,
        type,
        order,
        isActive,
        imageUrl,
        products: productIds
          ? {
              set: productIds.map((id: string) => ({ id })), // many-to-many güncelle
            }
          : undefined,
      },
      include: { products: true },
    });

    return NextResponse.json(updatedSlider);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Slider güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/sliders/:id
export async function DELETE(req: Request, { params }: Params) {
  try {
    await db.slider.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Slider başarıyla silindi" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Slider silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
