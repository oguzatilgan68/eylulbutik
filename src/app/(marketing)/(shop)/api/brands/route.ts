import { db } from "@/app/(marketing)/lib/db";
import Error from "next/error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await db.brand.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(brands);
  } catch (error: Error | any) {
    return NextResponse.json("Hata alını" + error.message);
  }
}

export async function POST(req: Request) {
  const { name, logoUrl } = await req.json();
  const brand = await db.brand.create({
    data: { name, logoUrl },
  });
  return NextResponse.json(brand);
}
