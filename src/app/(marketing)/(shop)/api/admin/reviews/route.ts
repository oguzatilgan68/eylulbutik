import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

// Listeleme (pagination + filtreleme)
export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const approved = searchParams.get("approved"); // "true", "false" ya da null
    const q = searchParams.get("q") || ""; // ürün veya kullanıcı adına göre arama

    const skip = (page - 1) * limit;

    const where: any = {
      ...(approved === "true" ? { isApproved: true } : {}),
      ...(approved === "false" ? { isApproved: false } : {}),
      ...(q
        ? {
            OR: [
              { product: { name: { contains: q, mode: "insensitive" } } },
              { user: { fullName: { contains: q, mode: "insensitive" } } },
              { user: { email: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          product: { select: { id: true, slug: true, name: true } },
          user: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Reviews fetch error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}