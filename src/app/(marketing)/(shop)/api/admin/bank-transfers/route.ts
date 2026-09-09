import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { AdminAuthError, requireAdmin } from "@/app/(marketing)/lib/adminAuth";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // PENDING, APPROVED, REJECTED (Filtreleme için)

    const whereClause: any = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const transfers = await db.bankTransferNotification.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            orderNo: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, transfers }, { status: 200 });
  } catch (err: any) {

    if (err instanceof AdminAuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode }
      );
    }

    console.error("Admin bank transfers fetch error:", err);
    return NextResponse.json(
      { error: "Havale bildirimleri yüklenirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}