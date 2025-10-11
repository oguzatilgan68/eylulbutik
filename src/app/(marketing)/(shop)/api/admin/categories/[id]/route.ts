import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Alt kategorileri varsa onları da silebilirsin ya da parentId null yap
    await db.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Kategori silindi" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Kategori silinemedi" }, { status: 500 });
  }
}
