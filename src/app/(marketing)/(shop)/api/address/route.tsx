import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addressSchema } from "@/app/(marketing)/lib/validations/address";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { db } from "@/app/(marketing)/lib/db";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId)
    return NextResponse.json({ error: "UserId required" }, { status: 400 });

  try {
    const addresses = await db.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
    return NextResponse.json({ addresses });
  } catch (err) {
    return NextResponse.json(
      { error: "Adresler alınamadı" + err },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = addressSchema.parse(body);
    const userId = await getAuthUserId();
    // Eğer varsayılan adres seçilmişse, önce diğerlerini false yap
    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await db.address.create({
      data: { ...data, userId },
    });

    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Adres eklenemedi" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = addressSchema.partial().parse(body);

    // Eğer varsayılan adres seçilmişse, önce diğerlerini false yap
    const userId = await getAuthUserId();
    if (updateData.isDefault) {
      await db.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await db.address.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ address: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Adres güncellenemedi" + err },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

    await db.address.delete({ where: { id } });
    return NextResponse.json({ message: "Adres silindi" });
  } catch (err) {
    return NextResponse.json({ error: "Adres silinemedi" }, { status: 500 });
  }
}
