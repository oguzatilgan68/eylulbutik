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
        background-color: #f4f4f7;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #0070f3;
        color: #ffffff;
        text-align: center;
        padding: 20px;
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
        background-color: #f4f4f7;
      }
      @media only screen and (max-width: 480px) {
        .container {
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
    <div class="container">
      <div class="header">
        Eylül Butik      
      </div>
      <div class="content">
        <p>Merhaba ${fullName},</p>
        <p>Hesabınızı güvenli hale getirmek için emailinizi doğrulamanız gerekiyor.</p>
        <p>Lütfen aşağıdaki butona tıklayarak emailinizi doğrulayın:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Emaili Doğrula</a>
        </p>
        <p>Bu link 24 saat boyunca geçerli olacaktır.</p>
        <p>Eğer bu isteği siz yapmadıysanız, bu emaili dikkate almanıza gerek yoktur.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Eylül Butik. Tüm hakları saklıdır.
      </div>
    </div>
  </body>
  </html>
  `,
  });
}
