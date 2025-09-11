import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const type = await db.propertyType.findUnique({
    where: { id: params.id },
    include: { values: true },
  });
  return NextResponse.json(type);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
  { params }: { params: { id: string } }
) {
  await db.propertyType.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
