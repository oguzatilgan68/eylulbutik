import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/app/(marketing)/lib/db";
import {
  generateEmailVerificationToken,
  sendVerificationEmail,
} from "@/app/(marketing)/lib/emailVerification";

export async function POST(req: NextRequest) {
  const { fullName, email, password, phone } = await req.json();

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: "Tüm alanlar gerekli" }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "Bu email zaten kayıtlı" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Token üret
  const {
    token: emailVerificationToken,
    expires: emailVerificationTokenExpires,
  } = generateEmailVerificationToken();

  // Kullanıcı oluştur
  const user = await db.user.create({
    data: {
      fullName,
      email,
      passwordHash: hashedPassword,
      phone,
      emailVerificationToken,
      emailVerificationTokenExpires,
      emailVerified: false,
    },
  });

  // Mail gönder (generic helper kullanıldı)
  await sendVerificationEmail(email, fullName, emailVerificationToken);

  return NextResponse.json({
    message: "Kayıt başarılı, lütfen emailinizi doğrulayın",
  });
}
