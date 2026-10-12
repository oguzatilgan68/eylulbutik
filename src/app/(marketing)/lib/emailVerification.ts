import crypto from "crypto";
import { sendEmail } from "./mail";
import { wrapEmailTemplate } from "./emailTemplate";

export function generateEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setHours(expires.getHours() + 24); // 24 saat geçerli
  return { token, expires };
}

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const emailHtml = wrapEmailTemplate({
    title: "Email Doğrulama",
    content: `
      <p>Merhaba <strong>${fullName}</strong>,</p>
      <p>Eylül Butik ailesine hoş geldiniz! Hesabınızı aktif hale getirmek için lütfen aşağıdaki butona tıklayarak email adresinizi doğrulayın:</p>
      <p style="text-align: center;">
        <a href="${verificationUrl}" class="button">Emaili Doğrula</a>
      </p>
      <p>Bu bağlantı <strong>24 saat</strong> boyunca geçerli olacaktır.</p>
      <p>Eğer bu hesabı siz oluşturmadıysanız, bu emaili dikkate almayabilirsiniz.</p>
    `,
  });

  await sendEmail({
    to: email,
    subject: "Emailinizi Doğrulayın - Eylül Butik",
    html: emailHtml,
  });
}