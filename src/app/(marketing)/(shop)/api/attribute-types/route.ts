import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

// ✅ GET: Listele
export async function GET() {
  try {
    const types = await db.attributeType.findMany({
      include: { values: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(types);
  } catch (error: any) {
    return NextResponse.json({ error: "Veriler getirilirken hata oluştu." }, { status: 500 });
  }
}

// ✅ POST: Yeni ekle
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, values } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Grup adı zorunludur." }, { status: 400 });
    }

    if (!Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ error: "En az bir seçenek eklemelisiniz." }, { status: 400 });
    }

    // Temizlik: Boşlukları kırp ve boş stringleri ele, benzersiz yap
    const cleanValues: string[] = Array.from(
      new Set(values.map((v: string) => v.trim()).filter(Boolean))
    );

    if (cleanValues.length === 0) {
      return NextResponse.json({ error: "Geçerli bir seçenek bulunamadı." }, { status: 400 });
    }

    const type = await db.attributeType.create({
      data: {
        name: name.trim(),
        values: {
          create: cleanValues.map((v) => ({ value: v })),
        },
      },
      include: { values: true },
    });

    return NextResponse.json(type, { status: 201 });
  } catch (error: any) {
    console.error("Attribute Type Oluşturma Hatası:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu grup adı veya içerdiği değerlerden biri zaten sistemde kayıtlı." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}