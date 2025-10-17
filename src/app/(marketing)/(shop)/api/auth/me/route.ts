import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Access Token'ı header'dan al
    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // 2️⃣ Refresh Token'ı cookie'den al
    const refreshToken = req.cookies.get("refreshToken")?.value;

    // Kullanıcı nesnesi başlangıçta null
    let user = null;

    // 3️⃣ Eğer accessToken varsa — doğrula
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
          userId: string;
        };

        user = await db.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            emailVerified: true,
          },
        });

        if (user) {
          return NextResponse.json({ user });
        }
      } catch {
        // Token süresi dolmuş olabilir → refresh token kontrolüne geç
      }
    }

    // 4️⃣ Access Token geçersizse veya yoksa → refresh token ile yenile
    if (refreshToken) {
      const existingUser = await db.user.findFirst({
        where: {
          refreshToken,
          refreshTokenExpiry: {
            gt: new Date(), // süresi geçmemiş olmalı
          },
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          emailVerified: true,
        },
      });

      if (existingUser) {
        // Yeni access token üret
        const newAccessToken = jwt.sign(
          { userId: existingUser.id },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        const res = NextResponse.json({ user: existingUser, refreshed: true });
        res.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return res;
      }
    }

    // 5️⃣ Eğer hiçbir token geçerli değilse
    return NextResponse.json({ user: null }, { status: 401 });
  } catch (err: any) {
    console.error("Auth check error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
