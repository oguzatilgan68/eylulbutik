import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { Decimal } from "@/generated/prisma/runtime/library";
export interface ProductUpdateBody {
  name?: string;
  price?: string;
  sku?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  inStock?: boolean;
  images?: { url: string; alt?: string }[];
  properties?: {
    propertyTypeId: string;
    propertyValueId: string;
    value?: string;
  }[];
  variants?: {
    sku?: string;
    price?: string;
    stockQty?: string;
    attributeValueIds?: string[];
    images?: { url: string; alt?: string }[];
  }[];
  modelInfoId?: string;
  modelSize?: string;
}
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        category: true,
        brand: true,
        properties: { include: { propertyType: true, propertyValue: true } },
        modelInfo: true,
        variants: {
          include: {
            images: true,
            attributes: { include: { value: { include: { type: true } } } },
          },
        },
      },
    });

    if (!product)
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ürün alınamadı" }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await db.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Ürün silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const productId = params.id;
    const data = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: "Güncellenecek veri yok." },
        { status: 400 }
      );
    }

    await db.$transaction(async (tx) => {
      // 1. Product update
      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          slug: data.sku,
          price: new Decimal(data.price || 0),
          description: data.description,
          categoryId: data.categoryId,
          brandId: data.brandId || undefined,
          status: data.status,
          inStock: data.inStock,
          modelInfoId: data.modelInfoId || undefined,
          modelSize: data.modelSize || undefined,
        },
      });

      // 2. Images reset
      await tx.productImage.deleteMany({ where: { productId } });
      if (data.images?.length) {
        await tx.productImage.createMany({
          data: data.images.map((img: any, idx: number) => ({
            productId,
            url: img.url,
            alt: img.alt || "",
            order: idx,
          })),
        });
      }

      // 3. Properties reset
      await tx.productProperty.deleteMany({ where: { productId } });
      if (data.properties?.length) {
        await tx.productProperty.createMany({
          data: data.properties.map((p: any) => ({
            productId,
            propertyTypeId: p.propertyTypeId,
            propertyValueId: p.propertyValueId,
          })),
        });
      }

      // 4. Variants reset
      await tx.productVariantAttribute.deleteMany({
        where: { variant: { productId } },
      });
      await tx.variantImage.deleteMany({ where: { variant: { productId } } });
      await tx.productVariant.deleteMany({ where: { productId } });

      if (data.variants?.length) {
        for (const v of data.variants) {
          const variant = await tx.productVariant.create({
            data: {
              productId,
              sku: v.sku || undefined,
              price: v.price ? new Decimal(v.price) : undefined,
              stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
            },
          });

          if (v.images?.length) {
            await tx.variantImage.createMany({
              data: v.images.map((img: any, idx: number) => ({
                variantId: variant.id,
                url: img.url,
                alt: img.alt || "",
                order: idx,
              })),
            });
          }

          if (v.attributeValueIds?.length) {
            await tx.productVariantAttribute.createMany({
              data: v.attributeValueIds.map((attrId: string) => ({
                variantId: variant.id,
                attributeValueId: attrId,
              })),
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product update error:", err);
    return NextResponse.json(
      { error: "Ürün güncellenemedi." },
      { status: 500 }
    );
  }
}
