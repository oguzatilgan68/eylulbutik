import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await db.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Ürün silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
