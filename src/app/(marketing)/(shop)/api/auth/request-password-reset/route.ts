import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/app/(marketing)/lib/mail";
import { wrapEmailTemplate } from "@/app/(marketing)/lib/emailTemplate";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 dakika

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetTokenExpires: expires,
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const emailHtml = wrapEmailTemplate({
    title: "Şifre Sıfırlama Talebi",
    content: `
      <p>Merhaba,</p>
      <p>Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Şifrenizi yenilemek için aşağıdaki butona tıklayabilirsiniz:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" class="button">Şifremi Sıfırla</a>
      </p>
      <p>Bu bağlantı <strong>30 dakika</strong> içinde geçerliliğini yitirecektir.</p>
      <p>Eğer bu talebi siz yapmadıysanız, bu emaili güvenle görmezden gelebilirsiniz.</p>
    `,
  });

  await sendEmail({
    to: email,
    subject: "Şifre Sıfırlama Talebi",
    html: emailHtml,
  });

  return NextResponse.json({ message: "Password reset link sent" });
}