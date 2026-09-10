import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const url = new URL(request.url);
    const q = url.searchParams.get("q") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const page = Number(url.searchParams.get("page") || "1");
    const perPage = Number(url.searchParams.get("perPage") || "20");

    const where: any = {};
    if (q) {
      where.OR = [
        { comment: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { fullName: { contains: q, mode: "insensitive" } } },
        {
          items: {
            some: {
              orderItem: {
                name: { contains: q, mode: "insensitive" },
              },
            },
          },
        },
      ];
    }
    if (status) where.status = status;

    const total = await db.returnRequest.count({ where });
    const returns = await db.returnRequest.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, fullName: true, phone: true } },
        items: {
          include: {
            orderItem: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
                variant: true,
              },
            },
          },
        },
        refunds: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return NextResponse.json({ data: returns, meta: { total, page, perPage } });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Return requests fetch error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status)
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );

    const updated = await db.returnRequest.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, email: true, fullName: true, phone: true } },
        items: {
          include: {
            orderItem: {
              include: {
                product: { include: { images: true } },
                variant: true,
              },
            },
          },
        },
        refunds: true,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Return request update error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}