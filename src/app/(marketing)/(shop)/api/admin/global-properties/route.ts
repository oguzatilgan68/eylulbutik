import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET() {
  try {
    await requireAdmin();

    const rawPropertyValues = await db.propertyValue.findMany({
      select: {
        id: true,
        value: true,
        propertyType: { select: { id: true, name: true } },
      },
    });

    const propertyTypes = Object.values(
      rawPropertyValues.reduce(
        (acc, pv) => {
          if (!acc[pv.propertyType.id]) {
            acc[pv.propertyType.id] = {
              id: pv.propertyType.id,
              name: pv.propertyType.name,
              values: [],
            };
          }
          acc[pv.propertyType.id].values.push({
            id: pv.id,
            value: pv.value,
          });
          return acc;
        },
        {} as Record<
          string,
          { id: string; name: string; values: { id: string; value: string }[] }
        >
      )
    );

    return NextResponse.json(propertyTypes);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("PropertyValue API hatası:", err);
    return NextResponse.json(
      { error: "PropertyValues alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: "Ad bilgisi gerekli" }, { status: 400 });
    }

    const type = await db.propertyType.create({
      data: {
        name,
      },
      include: { values: true },
    });
    return NextResponse.json(type);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}