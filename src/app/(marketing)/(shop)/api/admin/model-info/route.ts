import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const models = await db.modelInfo.findMany();
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: "Cannot fetch models" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const model = await db.modelInfo.create({
      data: {
        name: data.name,
        height: data.height,
        weight: data.weight,
        chest: data.chest,
        waist: data.waist,
        hip: data.hip,
      },
    });
    return NextResponse.json(model);
  } catch (error) {
    return NextResponse.json({ error: "Cannot create model" }, { status: 500 });
  }
}
