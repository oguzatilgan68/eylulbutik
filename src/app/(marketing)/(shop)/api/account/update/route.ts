import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  try {
    const userId = await getAuthUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { fullName, email, phone } = body;

    // Kullanıcıyı güncelle
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { fullName, email, phone },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
