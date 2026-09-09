import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const params = await props.params;
    const { id } = params;
    const model = await db.modelInfo.findUnique({ where: { id } });
    if (!model)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(model);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Cannot fetch model" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const params = await props.params;
    const { id } = params;
    const data = await req.json();
    const model = await db.modelInfo.update({
      where: { id },
      data,
    });
    return NextResponse.json(model);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Cannot update model" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const params = await props.params;
    const { id } = params;
    await db.modelInfo.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Cannot delete model" }, { status: 500 });
  }
}