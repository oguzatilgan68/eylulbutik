import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

// Tüm PropertyType ve değerlerini getir
export async function GET() {
  try {
    await requireAdmin();

    const types = await db.propertyType.findMany({
      include: { values: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(types);
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni PropertyType ve değerlerini ekle
export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { name, values } = body; // values: string[]
    if (!name || !values || !Array.isArray(values)) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    // 1. Önce bu isimde bir PropertyType var mı diye kontrol edelim
    let propertyType = await db.propertyType.findUnique({
      where: { name },
    });

    if (propertyType) {
      // Eğer varsa, yeni değerleri mevcut türe ekleyelim (Duplicate hatası almamak için)
      const existingValues = await db.propertyValue.findMany({
        where: { propertyTypeId: propertyType.id },
        select: { value: true },
      });
      const existingValueStrings = existingValues.map((v) => v.value);

      const newValues = values.filter(
        (v: string) => !existingValueStrings.includes(v)
      );

      propertyType = await db.propertyType.update({
        where: { id: propertyType.id },
        data: {
          values: {
            create: newValues.map((v: string) => ({ value: v })),
          },
        },
        include: { values: true },
      });
    } else {
      // Eğer yoksa yeni oluşturalım
      propertyType = await db.propertyType.create({
        data: {
          name,
          values: {
            create: values.map((v: string) => ({ value: v })),
          },
        },
        include: { values: true },
      });
    }

    return NextResponse.json(propertyType);
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();

    const { id, values } = await req.json();

    if (!id || !values?.length) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    // Mevcut değerleri al
    const existingValues = await db.propertyValue.findMany({
      where: { propertyTypeId: id },
      select: { value: true },
    });
    const existingValueStrings = existingValues.map((v) => v.value);

    // Sadece yeni değerleri ekle
    const newValues = values.filter(
      (v: string) => !existingValueStrings.includes(v)
    );

    const updated = await db.propertyType.update({
      where: { id },
      data: {
        values: {
          create: newValues.map((v: string) => ({ value: v })),
        },
      },
      include: { values: true },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("PATCH Hata:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}