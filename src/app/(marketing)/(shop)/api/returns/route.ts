import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, userId, reason, comment, items } = body;

    // items: [{ orderItemId, qty, reason }]

    // validate order belongs to user etc. (simplified)
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const returnRequest = await db.returnRequest.create({
      data: {
        order: { connect: { id: orderId } },
        user: userId ? { connect: { id: userId } } : undefined,
        reason,
        comment,
        items: {
          create: items.map((it: any) => ({
            orderItem: { connect: { id: it.orderItemId } },
            qty: it.qty,
            reason: it.reason,
          })),
        },
      },
      include: { items: { include: { orderItem: true } } },
    });

    return NextResponse.json(returnRequest);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // optional: ?userId=... or admin list
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const page = Number(url.searchParams.get("page") || 1);
  const limit = 20;
  const where = userId ? { userId } : {};
  const results = await db.returnRequest.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      items: { include: { orderItem: true } },
      order: true,
      user: true,
    },
  });
  return NextResponse.json(results);
}
