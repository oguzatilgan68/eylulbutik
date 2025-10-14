import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

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

  // 🔹 Artık adres bilgisi Order tablosunun içinde, o yüzden ayrı sorgu yok
  const address = {
    title: order.addressTitle,
    fullName: order.addressFullName,
    phone: order.addressPhone,
    city: order.addressCity,
    district: order.addressDistrict,
    neighbourhood: order.addressNeighbourhood,
    address1: order.addressDetail,
    zip: order.addressZip,
  };

  return NextResponse.json({ order, address });
}
