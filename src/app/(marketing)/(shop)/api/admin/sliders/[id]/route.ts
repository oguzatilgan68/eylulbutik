import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

// Dinamik ID parametresi al
interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/admin/sliders/:id
export async function GET(req: Request, props: Params) {
  try {
    await requireAdmin();

    const params = await props.params;
    const slider = await db.slider.findUnique({
      where: { id: params.id },
      include: { products: true },
    });

    if (!slider)
      return NextResponse.json({ error: "Slider bulunamadı" }, { status: 404 });

    return NextResponse.json(slider);
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: "Slider alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/sliders/:id
export async function PUT(req: Request, props: Params) {
  try {
    await requireAdmin();

    const params = await props.params;
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
              set: productIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: { products: true },
    });

    return NextResponse.json(updatedSlider);
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Slider güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/sliders/:id
export async function DELETE(req: Request, props: Params) {
  try {
    await requireAdmin();

    const params = await props.params;
    await db.slider.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Slider başarıyla silindi" });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Slider silinirken hata oluştu" },
      { status: 500 }
    );
  }
}