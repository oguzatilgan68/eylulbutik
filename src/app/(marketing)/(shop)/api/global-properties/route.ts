import { db } from "@/app/(marketing)/lib/db";
import Error from "next/error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const props = await db.propertyType.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(props);
  } catch (error: Error | any) {
    return NextResponse.json(error.message);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: "Ad gerekli" }, { status: 400 });
  }
  try {
    const prop = await db.propertyType.create({
      data: { name },
    });
    return NextResponse.json(prop);
  } catch (error: any) {
    console.error("Create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
