import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET() {
  try {
    await requireAdmin();
    const models = await db.modelInfo.findMany();
    return NextResponse.json(models);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Cannot fetch models" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
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
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Cannot create model" }, { status: 500 });
  }
}