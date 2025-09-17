import { db } from "@/app/(marketing)/lib/db";
import { CouponType, Prisma } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: list with search, page, perPage
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = parseInt(url.searchParams.get("perPage") || "12");

  const where: any = {};
  if (q) {
    where.OR = [{ code: { contains: q, mode: "insensitive" } }];
  }

  const [data, total] = await Promise.all([
    db.coupon.findMany({
      where,
      orderBy: { startsAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.coupon.count({ where }),
  ]);

  return NextResponse.json({ data, meta: { total } });
}

// POST: create
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, type, value, startsAt, endsAt, maxUses, isActive } = body;

  if (!code || !type || value == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const created = await db.coupon.create({
      data: {
        code: String(code).toUpperCase(),
        type: type as CouponType,
        value: new Prisma.Decimal(String(value)),
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        maxUses: maxUses ? Number(maxUses) : null,
        isActive: isActive === false ? false : true,
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

// PATCH: update (partial)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...patch } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const toUpdate: any = { ...patch };
    if (toUpdate.value != null)
      toUpdate.value = new Prisma.Decimal(String(toUpdate.value));
    if (toUpdate.startsAt != null)
      toUpdate.startsAt = new Date(toUpdate.startsAt);
    if (toUpdate.endsAt != null) toUpdate.endsAt = new Date(toUpdate.endsAt);
    if (toUpdate.maxUses != null) toUpdate.maxUses = Number(toUpdate.maxUses);

    const updated = await db.coupon.update({
      where: { id },
      data: toUpdate,
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

// DELETE: delete by id query param
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
