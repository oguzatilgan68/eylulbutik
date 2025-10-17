import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/app/(marketing)/lib/db";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token yok" }, { status: 401 });
  }

  // User tablosunda refresh token ve süresini kontrol et
  const user = await db.user.findFirst({
    where: {
      refreshToken,
      refreshTokenExpiry: { gt: new Date() }, // henüz geçerli
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Geçersiz veya süresi dolmuş refresh token" },
      { status: 401 }
    );
  }

  // Yeni access token üret
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  return NextResponse.json({ accessToken });
}
