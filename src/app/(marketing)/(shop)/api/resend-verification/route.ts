import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { generateEmailVerificationToken } from "@/app/(marketing)/lib/emailVerification";
import { sendEmail } from "@/app/(marketing)/lib/mail";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email gerekli" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı" },
      { status: 404 }
    );
  }

  if (user.emailVerified) {
    return NextResponse.json(
      { error: "Email zaten doğrulandı" },
      { status: 400 }
    );
  }

  // Token üret
  const { token, expires } = generateEmailVerificationToken();

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expires,
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Emailinizi doğrulayın",
    html: `<p>Merhaba ${user.fullName},</p>
           <p>Lütfen emailinizi doğrulamak için aşağıdaki linke tıklayın:</p>
           <a href="${verificationUrl}">Emaili Doğrula</a>
           <p>Link 24 saat geçerli olacaktır.</p>`,
  });

  return NextResponse.json({ message: "Doğrulama maili tekrar gönderildi" });
}
