import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import Error from "next/error";

// GET all property types with values
export async function GET() {
  try {
    const types = await db.propertyType.findMany({
      include: { values: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(types);
  } catch (error: Error | any) {
    return NextResponse.json(error);
  }
}

// CREATE property type
export async function POST(req: Request) {
  const body = await req.json();
  const type = await db.propertyType.create({
    data: {
      name: body.name,
    },
  });
  return NextResponse.json(type);
}
