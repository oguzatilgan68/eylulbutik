import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin yetkisini kontrol ediyoruz
    await requireAdmin();

    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variant: {
              include: {
                images: true,
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

    return NextResponse.json({ ...order, address });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Order detail fetch error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin yetkisini kontrol ediyoruz
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    const { status, trackingNo, provider, shipmentStatus } = body;

    // 1. Sipariş durumunu güncelle
    if (status) {
      await db.order.update({
        where: { id },
        data: { status },
      });
    }

    // 2. Kargo bilgisi güncelle veya oluştur (upsert)
    if (trackingNo !== undefined || provider !== undefined || shipmentStatus !== undefined) {
      await db.shipment.upsert({
        where: { orderId: id },
        update: {
          ...(trackingNo !== undefined && { trackingNo }),
          ...(provider !== undefined && { provider }),
          ...(shipmentStatus !== undefined && { status: shipmentStatus }),
        },
        create: {
          orderId: id,
          provider: provider || "Yurtiçi Kargo",
          trackingNo: trackingNo || "",
          status: shipmentStatus || "SHIPPED",
        },
      });
    }

    // Güncel veriyi tüm ilişkileriyle tekrar dön
    const updatedOrder = await db.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: { include: { images: true } },
            variant: { include: { images: true } },
          },
        },
        payment: true,
        shipment: true,
      },
    });

    const address = {
      title: updatedOrder?.addressTitle,
      fullName: updatedOrder?.addressFullName,
      phone: updatedOrder?.addressPhone,
      city: updatedOrder?.addressCity,
      district: updatedOrder?.addressDistrict,
      neighbourhood: updatedOrder?.addressNeighbourhood,
      address1: updatedOrder?.addressDetail,
      zip: updatedOrder?.addressZip,
    };

    return NextResponse.json({ ...updatedOrder, address });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message || "Güncelleme başarısız" }, { status: 500 });
  }
}