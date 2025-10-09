"use server";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Mevcut şifreyi doğrula
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash ?? "");
    if (!isMatch) {
      return NextResponse.json({ error: "Eski şifre yanlış" }, { status: 401 });
    }
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash: hashed },
    });

    return NextResponse.json({ message: "Şifre başarıyla değiştirildi" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
