import nodemailer from "nodemailer";

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
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
      <h2 style="color: #db2777;">Yeni İletişim Mesajı Var!</h2>
      <p><strong>Gönderen Kişi:</strong> ${name}</p>
      <p><strong>E-posta Adresi:</strong> ${email}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;" />
      <p><strong>Mesaj:</strong></p>
      <p style="background: #ffffff; padding: 15px; border-radius: 5px; border: 1px solid #eee;">${message}</p>
    </div>
  `;

  await sendEmail({
    to: process.env.SMTP_USER || "destek@eylulbutik.com", // Mesajın gideceği e-posta adresi
    subject: `Yeni İletişim Mesajı - ${name}`,
    html: htmlContent,
  });
}