import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { db } from "@/app/(marketing)/lib/db";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = search
      ? {
          OR: [
            {
              orderNo: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              user: {
                is: {
                  fullName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {};

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { user: true, items: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Siparişler alınamadı" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { ids } = body; // string[]

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Silinecek sipariş seçilmedi." }, { status: 400 });
    }

    // İlişkili tabloları (OrderItem, Payment, Shipment, BankTransferNotification) patlatmamak için transaction içinde siliyoruz
    await db.$transaction(async (tx) => {
      // 1. Siparişe bağlı OrderItem'ları sil
      await tx.orderItem.deleteMany({ where: { orderId: { in: ids } } });

      // 2. Ödeme kayıtlarını sil
      await tx.payment.deleteMany({ where: { orderId: { in: ids } } });

      // 3. Kargo kayıtlarını sil
      await tx.shipment.deleteMany({ where: { orderId: { in: ids } } });

      // 4. Havale bildirimlerini sil
      await tx.bankTransferNotification.deleteMany({ where: { orderId: { in: ids } } });

      // 5. Ana siparişleri sil
      await tx.order.deleteMany({ where: { id: { in: ids } } });
    });

    return NextResponse.json({ success: true, message: "Seçilen siparişler silindi." });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Sipariş silme hatası:", error);
    return NextResponse.json({ error: "Siparişler silinirken bir hata oluştu." }, { status: 500 });
  }
}