import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "./db";

export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Hiç token yoksa null döndür
  if (!accessToken && !refreshToken) return null;

  // 1️⃣ Access token varsa doğrula
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
        userId: string;
      };
      return decoded.userId; // geçerli token, kullanıcı id’si döndür
    } catch {
      // Token süresi dolmuş olabilir → refresh token ile yenilemeye geç
    }
  }

  // 2️⃣ Refresh token varsa kontrol et
  if (refreshToken) {
    const user = await db.user.findFirst({
      where: {
        refreshToken,
        refreshTokenExpiry: { gt: new Date() }, // token süresi geçmemiş olmalı
      },
      select: { id: true },
    });

    if (!user) return null; // geçersiz veya süresi dolmuş refresh token

    // 3️⃣ Yeni access token oluştur
    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // 4️⃣ Yeni access token’ı cookie’ye yaz
    cookieStore.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 dakika
    });

    return user.id;
  }

  // Hiçbir token geçerli değilse
  return null;
}
