import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET() {
  try {
    await requireAdmin();

    const data = await db.genericData.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("GET /generic-data error:", err);
    return NextResponse.json(
      { error: "Veriler alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// 🔹 Yeni GenericData oluştur
export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const newData = await db.genericData.create({
      data: body,
    });
    return NextResponse.json(newData);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("POST /generic-data error:", err);
    return NextResponse.json(
      { error: "Yeni veri oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// 🔹 Güncelle (ID zorunlu)
export async function PATCH(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await db.genericData.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("PATCH /generic-data error:", err);
    return NextResponse.json(
      { error: "Veri güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// 🔹 Sil (ID zorunlu)
export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.genericData.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("DELETE /generic-data error:", err);
    return NextResponse.json(
      { error: "Veri silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}