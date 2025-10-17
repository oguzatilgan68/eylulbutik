import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      // Refresh token sahibi kullanıcıyı bul
      const user = await db.user.findFirst({
        where: { refreshToken },
        select: { id: true },
      });

      if (user) {
        // Kullanıcının refresh token'ını sıfırla
        await db.user.update({
          where: { id: user.id },
          data: {
            refreshToken: null,
            refreshTokenExpiry: null,
          },
        });
      }
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  }

  // 🍪 Cookie’leri temizle
  const res = NextResponse.json({ message: "Çıkış yapıldı" });

  res.cookies.set({
    name: "accessToken",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(0),
  });

  res.cookies.set({
    name: "refreshToken",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(0),
  });

  return res;
}
