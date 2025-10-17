import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/(marketing)/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { error: "Email veya şifre hatalı" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Email veya şifre hatalı" },
      { status: 401 }
    );
  }

  // 🎟️ Access Token (15 dakika geçerli)
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  // 🔁 Refresh Token (7 gün geçerli)
  const refreshToken = uuidv4();
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

  await db.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
      refreshToken,
      refreshTokenExpiry,
    },
  });

  const res = NextResponse.json({ message: "Giriş başarılı" });

  // 🍪 Access Token cookie
  res.cookies.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    maxAge: 15 * 60, // 15 dakika
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  // 🍪 Refresh Token cookie
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
