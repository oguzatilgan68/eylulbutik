import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "./db";

export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) return null;

  try {
    // 🔹 1. Önce access token doğrula
    const decoded = jwt.verify(accessToken!, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch (err) {
    // 🔸 2. Access token expired olabilir → refreshToken deneyelim
    if (refreshToken) {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as { userId: string };

        // Kullanıcı hâlâ geçerli mi kontrol et
        const user = await db.user.findUnique({
          where: { id: decodedRefresh.userId },
          select: { id: true },
        });
        if (!user) return null;

        // 🔁 Yeni access token oluştur
        const newAccessToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        // Yeni cookie yaz (Next.js Route Handler içindeyken çalışır)
        (await cookies()).set({
          name: "token",
          value: newAccessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge: 15 * 60, // 15 dakika
        });

        return user.id;
      } catch {
        return null;
      }
    }

    return null;
  }
}
