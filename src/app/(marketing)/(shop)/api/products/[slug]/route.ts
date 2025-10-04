import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params;
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        brand: true,
        modelInfo: true,
        variants: {
          include: {
            images: true,
            attributes: {
              include: {
                value: { include: { type: true } },
              },
            },
          },
        },
        properties: {
          include: {
            propertyType: true,
            propertyValue: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Decimal → number dönüşümü ve attributes & properties mapping
    const safeProduct = {
      ...product,
      price: product.price ? Number(product.price) : 0,
      variants: product.variants.map((v) => ({
        ...v,
        price: v.price ? Number(v.price) : 0,
        attributes: v.attributes.map((a: any) => ({
          id: a.id,
          key: a.value.type.name,
          value: a.value.value,
        })),
      })),
      properties: product.properties.map((p: any) => ({
        id: p.id,
        key: p.propertyType.name,
        value: p.propertyValue.value,
      })),
    };

    return NextResponse.json(safeProduct);
  } catch (error) {
    console.error("❌ Product fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
