import { db } from "@/app/(marketing)/lib/db";
import { ReturnReason } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, userId, reason, comment, items } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
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
        reason: "OTHER",
        comment,
        items: {
          create: items.map((it: any) => ({
            orderItem: { connect: { id: it.orderItemId } },
            qty: it.qty,
            reason: it.reason ? (it.reason as ReturnReason) : undefined,
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
    const userId = url.searchParams.get("userId");
    const page = Number(url.searchParams.get("page") || 1);
    const limit = 20;

    const where = userId ? { userId } : {};

    const returnRequests = await db.returnRequest.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            orderItem: {
              include: { product: true, variant: true },
            },
          },
        },
        order: true,
        user: true,
        refunds: true, // iade sonrası refund bilgisi
      },
    });

    // Decimal -> number dönüşümü
    const plainRequests = returnRequests.map((r) => ({
      ...r,
      items: r.items.map((i) => ({
        ...i,
        qty: i.qty,
        orderItem: {
          ...i.orderItem,
          unitPrice: Number(i.orderItem.unitPrice),
        },
      })),
    }));

    return NextResponse.json(plainRequests);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
