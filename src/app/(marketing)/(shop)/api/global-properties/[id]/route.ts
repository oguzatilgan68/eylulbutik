import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

// ✅ Güncelle
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: "Ad gerekli" }, { status: 400 });
  }

  const updated = await db.propertyType.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(updated);
}

// ✅ Sil
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await db.propertyType.delete({ where: { id } });

  return NextResponse.json({ message: "Silindi" });
}
