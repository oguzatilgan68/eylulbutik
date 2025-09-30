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
    subject: "Emailinizi Doğrulayın",
    html: `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Doğrulama</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica', 'Arial', sans-serif;
        background-color: #f7f7f7;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #0070f3;
        color: #ffffff;
        text-align: center;
        padding: 25px 20px;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 30px 20px;
        color: #333333;
        line-height: 1.6;
      }
      .content p {
        margin: 15px 0;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin: 20px 0;
        background-color: #0070f3;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #888888;
        background-color: #f7f7f7;
      }
      @media only screen and (max-width: 480px) {
        .email-container {
          width: 95% !important;
        }
        .header {
          font-size: 20px !important;
          padding: 15px !important;
        }
        .content {
          padding: 20px 15px !important;
        }
        .button {
          padding: 10px 20px !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        Eylül Butik
      </div>
      <div class="content">
        <p>Merhaba ${user.fullName},</p>
        <p>Hesabınızı güvence altına almak için emailinizi doğrulamanız gerekiyor.</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Emaili Doğrula</a>
        </p>
        <p>Bu link 24 saat boyunca geçerli olacaktır.</p>
        <p>Eğer bu isteği siz yapmadıysanız, lütfen emaili dikkate almayın.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Eylül Butik. Tüm hakları saklıdır.
      </div>
    </div>
  </body>
  </html>
  `,
  });

  return NextResponse.json({ message: "Doğrulama maili tekrar gönderildi" });
}
