import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/app/(marketing)/lib/db";

// JWT doğrulama fonksiyonu
async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return (decoded as { id: string }).id;
  } catch (err) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);
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
