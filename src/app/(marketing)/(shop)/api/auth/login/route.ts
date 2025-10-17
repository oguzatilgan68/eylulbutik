import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/(marketing)/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({ where: { email } });

  // 🔒 Kullanıcı yoksa veya şifresi yoksa
  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { error: "Email veya şifre hatalı" },
      { status: 401 }
    );
  }

  // 🔐 Hesap kilitli mi kontrol et
  if (user.isLocked) {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMs = user.lockedUntil.getTime() - new Date().getTime();
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return NextResponse.json(
        { error: `Hesabınız ${remainingMinutes} dakika boyunca kilitli.` },
        { status: 403 }
      );
    } else {
      // Kilit süresi dolmuşsa hesabı yeniden aktif et
      await db.user.update({
        where: { id: user.id },
        data: { isLocked: false, failedLoginAttempts: 0, lockedUntil: null },
      });
      user.isLocked = false;
      user.failedLoginAttempts = 0;
    }
  }

  // 🔑 Şifreyi kontrol et
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    const newAttempts = user.failedLoginAttempts + 1;
    if (newAttempts >= 3) {
      // 🚫 3 başarısız denemede 15 dk kilitle
      const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);

      await db.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          isLocked: true,
          lockedUntil,
        },
      });
      return NextResponse.json(
        { error: "Hesabınız 15 dakika süreyle kilitlendi." },
        { status: 403 }
      );
    } else {
      // Sadece deneme sayısını artır
      await db.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: newAttempts },
      });

      return NextResponse.json(
        { error: "Email veya şifre hatalı" },
        { status: 401 }
      );
    }
  }

  // ✅ Başarılı giriş → sayaçları sıfırla
  await db.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      lastLogin: new Date(),
    },
  });

  // 🎟️ Access Token (15 dk geçerli)
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  // 🔁 Refresh Token (7 gün geçerli)
  const refreshToken = uuidv4();
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

  await db.user.update({
    where: { id: user.id },
    data: { refreshToken, refreshTokenExpiry },
  });

  const res = NextResponse.json({ message: "Giriş başarılı" });

  // 🍪 Access Token Cookie
  res.cookies.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    maxAge: 15 * 60, // 15 dakika
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  // 🍪 Refresh Token Cookie
  res.cookies.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 gün
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
