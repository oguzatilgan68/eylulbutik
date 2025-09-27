import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token bulunamadı!" }, { status: 400 });
  }

  // Token ile kullanıcı bul
  const user = await db.user.findFirst({
    where: { emailVerificationToken: token },
  });

  if (!user) {
    return NextResponse.json({ error: "Geçersiz token!" }, { status: 400 });
  }

  // Token süresini kontrol et
  if (
    !user.emailVerificationTokenExpires ||
    user.emailVerificationTokenExpires < new Date()
  ) {
    return NextResponse.json(
      { error: "Token süresi dolmuş!" },
      { status: 400 }
    );
  }

  // Kullanıcıyı doğrula
  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });

  return NextResponse.json({ message: "Email başarıyla doğrulandı!" });
}
