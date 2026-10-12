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

  // Eğer token veritabanında yoksa, belki de ilk istekte zaten doğrulanıp temizlenmiştir.
  // Kullanıcının daha önce doğrulanıp doğrulanmadığını kontrol edelim:
  if (!user) {
    const alreadyVerifiedUser = await db.user.findFirst({
      where: { emailVerified: true },
    });
    
    // Eğer sistemde token yok ama kullanıcı doğrulanmışsa başarılı dön
    if (alreadyVerifiedUser) {
      return NextResponse.json({ message: "Email zaten doğrulanmış!" });
    }

    return NextResponse.json({ error: "Geçersiz veya süresi dolmuş token!" }, { status: 400 });
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