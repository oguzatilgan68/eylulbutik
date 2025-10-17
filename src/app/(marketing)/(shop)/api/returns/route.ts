import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { db } from "@/app/(marketing)/lib/db";
import { ReturnReason } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { orderId, comment, items } = body;
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    // items: [{ orderItemId, qty, reason }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "items are required" },
        { status: 400 }
      );
    }

    // validate order exists
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.deliveredAt) {
      return NextResponse.json(
        { error: "Sipariş henüz teslim edilmedi." },
        { status: 400 }
      );
    }

    const now = new Date();
    const deliveredDate = new Date(order.deliveredAt);
    const diffDays =
      (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 15) {
      return NextResponse.json(
        {
          error:
            "İade talebi oluşturmak için teslim tarihinden itibaren 15 günden fazla geçmemeli.",
        },
        { status: 400 }
      );
    }

    const returnRequest = await db.returnRequest.create({
      data: {
        order: { connect: { id: orderId } },
        user: userId ? { connect: { id: userId } } : undefined,
        comment,
        items: {
          create: items.map((it: any) => ({
            orderItem: { connect: { id: it.orderItemId } },
            qty: it.qty,
            reason: it.reason as ReturnReason,
            status: "PENDING",
          })),
        },
      },
      include: {
        items: {
          include: { orderItem: true },
        },
      },
    });

    return NextResponse.json(returnRequest);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const page = Number(url.searchParams.get("page") || 1);
    const limit = 20;

    const totalCount = await db.returnRequest.count({
      where: { userId },
    });
    const totalPages = Math.ceil(totalCount / limit);

    const returnRequests = await db.returnRequest.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        comment: true,
        status: true,
        createdAt: true,
        order: {
          select: {
            id: true,
            orderNo: true,
            createdAt: true,
            total: true,
          },
        },
        items: {
          select: {
            id: true,
            qty: true,
            reason: true,
            status: true,
            orderItem: {
              select: {
                id: true,
                unitPrice: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: {
                      select: { url: true },
                      take: 1,
                    },
                  },
                },
                variant: {
                  select: { id: true, attributes: true },
                },
              },
            },
          },
        },
      },
    });

    const plainRequests = returnRequests.map((r) => ({
      ...r,
      items: r.items.map((i) => ({
        ...i,
        orderItem: {
          ...i.orderItem,
          unitPrice: Number(i.orderItem.unitPrice),
        },
      })),
    }));

    return NextResponse.json({ items: plainRequests, totalPages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
