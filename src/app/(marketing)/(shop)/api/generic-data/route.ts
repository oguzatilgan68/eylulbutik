import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

// 🔹 TÜM GenericData kayıtlarını getir
export async function GET() {
  try {
    const data = await db.genericData.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /generic-data error:", error);
    return NextResponse.json(
      { error: "Veriler alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// 🔹 Yeni GenericData oluştur
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newData = await db.genericData.create({
      data: body,
    });
    return NextResponse.json(newData);
  } catch (error) {
    console.error("POST /generic-data error:", error);
    return NextResponse.json(
      { error: "Yeni veri oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// 🔹 Güncelle (ID zorunlu)
export async function PATCH(req: Request) {
  try {
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
  } catch (error) {
    console.error("PATCH /generic-data error:", error);
    return NextResponse.json(
      { error: "Veri güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// 🔹 Sil (ID zorunlu)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.genericData.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /generic-data error:", error);
    return NextResponse.json(
      { error: "Veri silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
