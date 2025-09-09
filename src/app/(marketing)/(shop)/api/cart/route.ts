import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Auth ile kullanıcı ID'si alıyoruz
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Giriş yapılmamış" }, { status: 401 });
    }

    const cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                brand: true,
                category: true,
                variants: {
                  include: {
                    attributes: {
                      include: {
                        value: {
                          include: { type: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            variant: {
              include: {
                attributes: {
                  include: {
                    value: {
                      include: { type: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    // Decimal değerleri number’a çeviriyoruz
    const serializedItems = cart.items.map((item) => ({
      id: item.id,
      qty: item.qty,
      unitPrice: Number(item.unitPrice),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price ? Number(item.product.price) : 0,
        images: item.product.images.map((img) => ({ url: img.url })),
        brand: item.product.brand
          ? { id: item.product.brand.id, name: item.product.brand.name }
          : null,
        category: item.product.category
          ? { id: item.product.category.id, name: item.product.category.name }
          : null,
      },
      variant: item.variant
        ? {
            id: item.variant.id,
            attributes: item.variant.attributes.map((attr) => ({
              id: attr.id,
              value: attr.value?.value ?? "",
              attributeType: attr.value?.type
                ? {
                    id: attr.value.type.id,
                    name: attr.value.type.name,
                  }
                : null,
            })),
          }
        : null,
    }));

    return NextResponse.json({ items: serializedItems });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sepet getirilemedi" }, { status: 500 });
  }
}
