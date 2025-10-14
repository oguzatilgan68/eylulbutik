import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { db } from "@/app/(marketing)/lib/db";
import { ReturnReason } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, reason, comment, items } = body;

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

    // Tek bir string için kontrol

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
    const page = Number(url.searchParams.get("page") || 1);
    const limit = 20;

    const where = userId ? { userId } : {};

    const totalCount = await db.returnRequest.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    const returnRequests = await db.returnRequest.findMany({
      where,
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
                      select: {
                        url: true,
                      },
                      take: 1,
                    },
                  },
                },
                variant: {
                  select: {
                    id: true,
                    attributes: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Decimal -> number dönüşümü
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
