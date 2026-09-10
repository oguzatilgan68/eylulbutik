import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions"; // authOptions dosyanın yolu (gerekirse kendi yoluna göre düzenle)
import { db } from "@/app/(marketing)/lib/db";

export async function GET() {
  try {
    // 1. NextAuth oturumunu sunucu tarafında güvenle alıyoruz
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // 2. Veritabanından en güncel kullanıcı bilgilerini çekiyoruz
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user, refreshed: false }, { status: 200 });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}