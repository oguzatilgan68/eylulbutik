import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const { propertyTypeId, value } = body;

  if (!propertyTypeId || !value) {
    return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
  }

  const updated = await db.productProperty.update({
    where: { id },
    data: { propertyTypeId, value },
    include: { product: true, propertyType: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await db.productProperty.delete({ where: { id } });

  return NextResponse.json({ message: "Silindi" });
}
