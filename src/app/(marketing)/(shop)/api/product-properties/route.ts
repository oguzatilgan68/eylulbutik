import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const properties = await db.productProperty.findMany({
    include: { product: true, propertyType: true },
    orderBy: { propertyType: { name: "asc" } },
  });
  return NextResponse.json(properties);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { productId, propertyTypeId, value } = body;

  if (!productId || !propertyTypeId || !value) {
    return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
  }

  const property = await db.productProperty.create({
    data: { productId, propertyTypeId, value },
    include: { product: true, propertyType: true },
  });

  return NextResponse.json(property);
}
