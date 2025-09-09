import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

// ✅ GET: Listele
export async function GET() {
  const types = await db.attributeType.findMany({
    include: { values: true },
  });
  return NextResponse.json(types);
}

// ✅ POST: Yeni ekle
export async function POST(req: Request) {
  const body = await req.json();
  const { name, values } = body;

  const type = await db.attributeType.create({
    data: {
      name,
      values: {
        create: values?.map((v: string) => ({ value: v })) || [],
      },
    },
    include: { values: true },
  });

  return NextResponse.json(type);
}
