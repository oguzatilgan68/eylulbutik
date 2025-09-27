// app/api/auth/request-password-reset/route.ts
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/app/(marketing)/lib/mail";

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

  const emailHtml = `
    <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
    <a href="${resetLink}">Şifre Sıfırlama Linki</a>
    <p>Bu bağlantı 30 dakika içinde geçersiz olacaktır.</p>
  `;
  await sendEmail({
    to: email,
    subject: "Şifre Sıfırlama Talebi",
    html: emailHtml,
  });

  return NextResponse.json({ message: "Password reset link sent" });
}
