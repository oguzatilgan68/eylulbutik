import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth"; // varsa auth kontrolü için

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🔒 auth kontrolü
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
          variant: {
            include: {
              attributes: {
                include: {
                  value: { include: { type: true } },
                },
              },
            },
          },
        },
      },
      payment: true,
      shipment: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const address = order.addressId
    ? await db.address.findUnique({ where: { id: order.addressId } })
    : null;

  return NextResponse.json({ order, address });
}
