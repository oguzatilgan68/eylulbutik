import { getServerSession } from "next-auth";
import { db } from "@/app/(marketing)/lib/db";
import { authOptions } from "@/app/utils/authOptions";

export class AdminAuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AdminAuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Oturumu ve ADMIN rolünü doğrular.
 * Yetkisizse AdminAuthError fırlatır, yetkiliyse kullanıcıyı döner.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  // 1. Oturum kontrolü
  if (!session || !session.user?.email) {
    throw new AdminAuthError("Yetkisiz erişim: Lütfen giriş yapın.", 401);
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new AdminAuthError("Kullanıcı bulunamadı.", 401);
  }

  if (user.role !== "ADMIN") {
    throw new AdminAuthError("Yasaklandı: Bu işlem için admin yetkisi gerekiyor.", 403);
  }
  return user;
}