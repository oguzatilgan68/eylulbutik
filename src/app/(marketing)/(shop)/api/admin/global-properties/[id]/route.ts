import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const type = await db.propertyType.findUnique({
    where: { id: params.id },
    include: { values: true },
  });
  return NextResponse.json(type);
}
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;
  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }

  try {
    // Önce mevcut değerleri sil
    // Yeni değerleri ekle
    const updated = await db.propertyType.update({
      where: { id },
      data: {
        name: name,
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const body = await req.json();
  const type = await db.propertyType.update({
    where: { id: params.id },
    data: {
      name: body.name,
      values: {
        deleteMany: {}, // önce eski value’ları temizle
        create: body.values?.map((v: string) => ({ value: v })) || [],
      },
    },
    include: { values: true },
  });
  return NextResponse.json(type);
}

export async function DELETE(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await db.propertyType.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
