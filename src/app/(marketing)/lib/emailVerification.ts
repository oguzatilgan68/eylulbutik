import crypto from "crypto";
import { sendEmail } from "./mail";

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
  await sendEmail({
    to: email,
    subject: "Emailinizi doğrulayın",
    html: `<p>Merhaba ${fullName},</p>
           <p>Lütfen emailinizi doğrulamak için aşağıdaki linke tıklayın:</p>
           <a href="${verificationUrl}">Emaili Doğrula</a>
           <p>Link 24 saat geçerli olacaktır.</p>`,
  });
}
