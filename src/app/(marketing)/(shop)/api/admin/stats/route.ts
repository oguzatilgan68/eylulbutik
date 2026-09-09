import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET() {
  try {
    // 1. Temel Sayımlar ve Toplam Ciro
    const [
      totalProducts,
      totalOrders,
      pendingBankTransfers,
      totalCategories,
      orders
    ] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.bankTransferNotification.count({ where: { status: "PENDING" } }),
      db.category.count(),
      db.order.findMany({
        select: { total: true, status: true },
      }),
    ]);

    // Toplam ciro (Yalnızca PAID veya FULFILLED olan siparişler)
    const totalRevenue = orders
      .filter((o) => o.status === "PAID" || o.status === "FULFILLED")
      .reduce((sum, o) => sum + Number(o.total), 0);

    // 2. Son 5 Siparişi Çek
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalProducts,
          totalOrders,
          pendingBankTransfers,
          totalCategories,
          totalRevenue,
        },
        recentOrders,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "İstatistikler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}