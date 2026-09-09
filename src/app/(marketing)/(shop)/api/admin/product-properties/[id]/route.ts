import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { values } = body;

    if (!values || !Array.isArray(values)) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    // Önce mevcut değerleri sil
    await db.propertyValue.deleteMany({ where: { propertyTypeId: id } });

    // Yeni değerleri ekle
    const updated = await db.propertyType.update({
      where: { id },
      data: {
        values: {
          create: values.map((v: string) => ({ value: v })),
        },
      },
      include: { values: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PropertyType ve bağlı değerleri sil
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const params = await props.params;
    const { id } = params;

    await db.propertyType.delete({ where: { id } });
    return NextResponse.json({ message: "Silindi" });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}