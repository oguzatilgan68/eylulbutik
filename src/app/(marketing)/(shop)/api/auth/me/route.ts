import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = req.cookies;

    // 1️⃣ Access Token ve Refresh Token
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let user = null;

    // 2️⃣ Access Token varsa doğrula
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
          return NextResponse.json({ user, refreshed: false });
        }
      } catch {
        // Token süresi dolmuş olabilir → refresh token kontrolü
      }
    }

    // 3️⃣ Access Token yok veya süresi dolmuş → refresh token ile yenile
    if (refreshToken) {
      const existingUser = await db.user.findFirst({
        where: { refreshToken, refreshTokenExpiry: { gt: new Date() } },
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

        // 🍪 Yeni access token cookie'ye yaz
        res.cookies.set({
          name: "accessToken",
          value: newAccessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60, // 15 dk
        });

        return res;
      }
    }

    // 4️⃣ Hiçbir token geçerli değilse
    return NextResponse.json({ user: null }, { status: 401 });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
