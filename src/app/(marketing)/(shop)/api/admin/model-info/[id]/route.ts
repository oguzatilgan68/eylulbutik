import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const model = await db.modelInfo.findUnique({ where: { id } });
    if (!model)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(model);
  } catch {
    return NextResponse.json({ error: "Cannot fetch model" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json();
  try {
    const model = await db.modelInfo.update({
      where: { id },
      data,
    });
    return NextResponse.json(model);
  } catch {
    return NextResponse.json({ error: "Cannot update model" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await db.modelInfo.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Cannot delete model" }, { status: 500 });
  }
}
