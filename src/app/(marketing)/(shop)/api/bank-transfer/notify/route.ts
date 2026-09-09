import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { z } from "zod";

// Zod ile gelen verileri doğrulayalım
const notifySchema = z.object({
  orderId: z.string().uuid("Geçersiz sipariş ID"),
  senderName: z.string().min(3, "Gönderen ad soyad en az 3 karakter olmalı"),
  bankName: z.string().optional(),
  amount: z.number().positive("Geçerli bir tutar girilmelidir"),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validasyon kontrolü
    const validation = notifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { orderId, senderName, bankName, amount, note } = validation.data;

    // 2. Siparişin var olup olmadığını kontrol et (Doğru ilişki adı kullanıldı)
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { bankTransferNotifications: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "İlgili sipariş bulunamadı" },
        { status: 404 }
      );
    }

    // 3. Daha önceden bu sipariş için bekleyen veya onaylanmış bir havale bildirimi var mı kontrol et
    const existingPending = order.bankTransferNotifications.find(
      (t) => t.status === "PENDING" || t.status === "APPROVED"
    );

    if (existingPending) {
      return NextResponse.json(
        { error: "Bu sipariş için zaten aktif veya onaylanmış bir havale bildirimi mevcut." },
        { status: 400 }
      );
    }

    // 4. Gönderilen tutarın sipariş toplamıyla uyuşup uyuşmadığını kontrol et
    const orderTotal = Number(order.total);
    if (Math.abs(orderTotal - amount) > 0.01) {
      return NextResponse.json(
        { error: `Bildirilen tutar (${amount} ₺) sipariş tutarı (${orderTotal} ₺) ile uyuşmuyor.` },
        { status: 400 }
      );
    }

    // 5. Havale bildirimini veritabanına kaydet
    const transferNotification = await db.bankTransferNotification.create({
      data: {
        orderId,
        userId: order.userId || "", 
        senderName,
        bankName: bankName || null,
        amount,
        note: note || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ödeme bildiriminiz başarıyla alındı. Admin onayından sonra siparişiniz işleme alınacaktır.",
        data: transferNotification,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Bank transfer notification error:", err);
    return NextResponse.json(
      { error: "Ödeme bildirimi kaydedilirken bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}