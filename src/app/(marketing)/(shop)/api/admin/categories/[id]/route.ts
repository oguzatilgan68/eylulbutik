import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const params = await props.params;
    const { id } = params;

    await db.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Kategori silindi" }, { status: 200 });
  } catch (err: any) {
    // Eğer hata bizim tanımladığımız AdminAuthError ise, 401 veya 403 dönüyoruz
    if (err instanceof AdminAuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode }
      );
    }

    console.error("Category delete error:", err);
    return NextResponse.json({ error: "Kategori silinemedi" }, { status: 500 });
  }
}