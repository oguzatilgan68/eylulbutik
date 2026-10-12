import nodemailer from "nodemailer";
import { wrapEmailTemplate } from "./emailTemplate";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, 
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: `"Eylül Butik" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email gönderme hatası:", error);
    throw new Error("Email gönderilemedi");
  }
}

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const innerContent = `
    <h2 style="color: #db2777; margin-top: 0;">Yeni İletişim Mesajı Var!</h2>
    <p><strong>Gönderen Kişi:</strong> ${name}</p>
    <p><strong>E-posta Adresi:</strong> ${email}</p>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
    <p><strong>Mesaj İçeriği:</strong></p>
    <p style="background: #fdf2f8; padding: 15px; border-radius: 8px; border: 1px solid #fce7f3; color: #4a5568;">${message}</p>
  `;

  const emailHtml = wrapEmailTemplate({
    title: "Yeni İletişim Mesajı",
    content: innerContent,
  });

  await sendEmail({
    to: process.env.SMTP_USER || "destek@eylulbutik.com",
    subject: `Yeni İletişim Mesajı - ${name}`,
    html: emailHtml,
  });
}