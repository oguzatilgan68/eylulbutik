import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/app/(marketing)/lib/db";
import {
  generateEmailVerificationToken,
  sendVerificationEmail,
} from "@/app/(marketing)/lib/emailVerification";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, phone } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Tüm alanlar gerekli" },
        { status: 400 }
      );
    }

    // Email kontrolü
    const existingEmailUser = await db.user.findUnique({ where: { email } });
    if (existingEmailUser) {
      return NextResponse.json(
        { error: "Bu email zaten kayıtlı" },
        { status: 400 }
      );
    }

    // Telefon kontrolü (telefon alanı doluysa)
    if (phone) {
      const existingPhoneUser = await db.user.findFirst({
        where: { phone },
      });
      if (existingPhoneUser) {
        return NextResponse.json(
          { error: "Bu telefon numarası zaten kayıtlı" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Email doğrulama token üret
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

    // Mail gönder
    await sendVerificationEmail(email, fullName, emailVerificationToken);

    return NextResponse.json({
      message: "Kayıt başarılı, lütfen emailinizi doğrulayın",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
