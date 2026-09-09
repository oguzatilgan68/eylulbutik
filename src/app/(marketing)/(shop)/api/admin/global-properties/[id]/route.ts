import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const params = await props.params;
    const type = await db.propertyType.findUnique({
      where: { id: params.id },
      include: { values: true },
    });
    return NextResponse.json(type);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
    }

    const updated = await db.propertyType.update({
      where: { id },
      data: {
        name: name,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const params = await props.params;
    const body = await req.json();
    const type = await db.propertyType.update({
      where: { id: params.id },
      data: {
        name: body.name,
        values: {
          deleteMany: {},
          create: body.values?.map((v: string) => ({ value: v })) || [],
        },
      },
      include: { values: true },
    });
    return NextResponse.json(type);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const params = await props.params;
    await db.propertyType.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}