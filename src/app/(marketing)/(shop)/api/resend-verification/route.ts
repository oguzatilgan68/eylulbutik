import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { generateEmailVerificationToken } from "@/app/(marketing)/lib/emailVerification";
import { sendEmail } from "@/app/(marketing)/lib/mail";
import { wrapEmailTemplate } from "@/app/(marketing)/lib/emailTemplate";

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

  const { token, expires } = generateEmailVerificationToken();

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expires,
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const emailHtml = wrapEmailTemplate({
    title: "Email Doğrulama",
    content: `
      <p>Merhaba <strong>${user.fullName}</strong>,</p>
      <p>Hesabınızı güvenli hale getirmek ve alışverişe başlamak için email adresinizi doğrulamanız gerekiyor.</p>
      <p style="text-align: center;">
        <a href="${verificationUrl}" class="button">Emaili Doğrula</a>
      </p>
      <p>Bu link <strong>24 saat</strong> boyunca geçerli olacaktır.</p>
      <p>Eğer bu isteği siz yapmadıysanız, bu emaili dikkate almanıza gerek yoktur.</p>
    `,
  });

  await sendEmail({
    to: email,
    subject: "Emailinizi Doğrulayın - Eylül Butik",
    html: emailHtml,
  });

  return NextResponse.json({ message: "Doğrulama maili tekrar gönderildi" });
}