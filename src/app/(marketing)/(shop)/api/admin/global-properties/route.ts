// app/api/admin/global-properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET() {
  try {
    const rawPropertyValues = await db.propertyValue.findMany({
      select: {
        id: true,
        value: true,
        propertyType: { select: { id: true, name: true } },
      },
    });

    // 🔹 propertyTypes organize et
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
  } catch (error) {
    console.error("PropertyValue API hatası:", error);
    return NextResponse.json(
      { error: "PropertyValues alınamadı" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body; // values: string[]
  if (!name) {
    return NextResponse.json({ error: "Ad bilgisi gerekli" }, { status: 400 });
  }
  try {
    const type = await db.propertyType.create({
      data: {
        name,
      },
      include: { values: true },
    });
    return NextResponse.json(type);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
