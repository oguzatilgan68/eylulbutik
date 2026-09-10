import { sendContactEmail } from "@/app/(marketing)/lib/mail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basit doğrulama
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Tüm alanların doldurulması zorunludur." },
        { status: 400 }
      );
    }

    // Nodemailer ile maili gönder
    await sendContactEmail({ name, email, message });

    return NextResponse.json(
      { success: true, message: "Mesajınız başarıyla gönderildi." },
      { status: 200 }
    );
  } catch (error) {
    console.error("İletişim formu API hatası:", error);
    return NextResponse.json(
      { success: false, error: "Mesaj gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}