import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/app/(marketing)/lib/db";
import { authOptions } from "@/app/utils/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Veritabanından en güncel kullanıcı bilgilerini çekelim
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

    return NextResponse.json({ user, refreshed: false });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}