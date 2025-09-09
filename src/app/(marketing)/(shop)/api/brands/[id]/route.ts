import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const brand = await db.brand.findUnique({ where: { id: params.id } });
  if (!brand)
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  return NextResponse.json(brand);
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { name, logoUrl } = await req.json();
  const brand = await db.brand.update({
    where: { id: params.id },
    data: { name, logoUrl },
  });
  return NextResponse.json(brand);
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await db.brand.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Brand deleted" });
}
