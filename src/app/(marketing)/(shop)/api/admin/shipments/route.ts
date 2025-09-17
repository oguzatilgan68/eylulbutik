import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/app/(marketing)/lib/db";
import { ShipmentStatus, ShippingProvider } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || undefined;
  const provider = url.searchParams.get("provider") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "12", 10);

  const where: any = {};
  if (q) {
    where.OR = [
      { orderId: { contains: q, mode: "insensitive" } },
      { trackingNo: { contains: q, mode: "insensitive" } },
      { raw: { path: ["note"], equals: q } }, // optional, example of JSON search
    ];
  }
  if (provider) where.provider = provider;
  if (status) where.status = status;

  const [data, total] = await Promise.all([
    db.shipment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.shipment.count({ where }),
  ]);

  return NextResponse.json({ data, meta: { total } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, provider, trackingNo, status, raw } = body;

    if (!orderId || !provider) {
      return NextResponse.json(
        { error: "orderId and provider are required" },
        { status: 400 }
      );
    }

    const created = await db.shipment.create({
      data: {
        orderId,
        provider: provider as ShippingProvider,
        trackingNo: trackingNo || null,
        status: status ? (status as ShipmentStatus) : undefined,
        raw: raw ?? null,
      },
    });

    return NextResponse.json({ data: created });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...patch } = body;
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    const data: any = { ...patch };
    if (data.provider) data.provider = data.provider as ShippingProvider;
    if (data.status) data.status = data.status as ShipmentStatus;

    // If raw is provided and is object, keep it
    if (data.raw === undefined) delete data.raw;

    const updated = await db.shipment.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    await db.shipment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
