import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

// ✅ GET tek kayıt
export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const type = await db.attributeType.findUnique({
      where: { id: params.id },
      include: { values: true },
    });

    if (!type) {
      return NextResponse.json(
        { error: "Attribute tipi bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(type);
  } catch (error) {
    console.error("GET AttributeType error:", error);
    return NextResponse.json(
      { error: "Beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}

// ✅ PUT: Güncelle
export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    const { name, values } = body;

    if (!name || !Array.isArray(values)) {
      return NextResponse.json(
        { error: "Geçersiz veri gönderildi." },
        { status: 400 }
      );
    }

    const updated = await db.attributeType.update({
      where: { id: params.id },
      data: {
        name,
        values: {
          deleteMany: {}, // eski değerleri sil
          create: values.map((v: string) => ({ value: v })),
        },
      },
      include: { values: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT AttributeType error:", error);
    return NextResponse.json(
      { error: "Attribute tipi güncellenemedi." },
      { status: 500 }
    );
  }
}

// ✅ DELETE
export async function DELETE(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await db.attributeType.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE AttributeType error:", error);
    return NextResponse.json(
      { error: "Attribute tipi silinemedi." },
      { status: 500 }
    );
  }
}
