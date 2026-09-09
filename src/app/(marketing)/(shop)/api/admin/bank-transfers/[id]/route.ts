import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { z } from "zod";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

const actionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  adminNote: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Admin yetkisini ve oturumu kontrol et
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    
    const validation = actionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { action, adminNote } = validation.data;

    // 2. Havale bildirimini bul
    const transfer = await db.bankTransferNotification.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "Havale bildirimi bulunamadı." },
        { status: 404 }
      );
    }

    if (transfer.status === "APPROVED") {
      return NextResponse.json(
        { error: "Bu bildirim zaten daha önce onaylanmış." },
        { status: 400 }
      );
    }

    const newTransferStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    const newOrderStatus = action === "APPROVE" ? "PAID" : "PENDING"; // Onaylanırsa sipariş Ödendi olur

    // 3. Transaction ile güvenli güncelleme
    await db.$transaction(async (tx) => {
      // A. Bildirimi güncelle
      await tx.bankTransferNotification.update({
        where: { id },
        data: {
          status: newTransferStatus,
          adminNote: adminNote || null,
        },
      });

      // B. Sipariş durumunu güncelle
      await tx.order.update({
        where: { id: transfer.orderId },
        data: {
          status: newOrderStatus,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: `Havale bildirimi başarıyla ${
          action === "APPROVE" ? "onaylandı ve sipariş ödendi olarak işaretlendi" : "reddedildi"
        }.`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    // Eğer hata bizim tanımladığımız AdminAuthError ise, 401 veya 403 dönüyoruz
    if (err instanceof AdminAuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode }
      );
    }

    console.error("Bank transfer action error:", err);
    return NextResponse.json(
      { error: "İşlem sırasında bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}