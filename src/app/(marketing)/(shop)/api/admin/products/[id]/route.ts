import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { Decimal } from "@/generated/prisma/runtime/library";
import { ProductImage, ProductProperty } from "@/generated/prisma";
import { generateUniqueSlug } from "../generate-slug";

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
export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const data = await req.json();
    const productId = params.id;
    const slug = await generateUniqueSlug(data.name);

    await db.$transaction(async (tx) => {
      // 1. Product update
      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          slug: slug,
          price: new Decimal(data.price || 0),
          description: data.description,
          categoryId: data.categoryId,
          brandId: data.brandId || null,
          status: data.status,
          inStock: data.inStock,
          modelInfoId: data.modelInfoId || null,
          modelSize: data.modelSize || "",
        },
      });

      // 2. Görseller
      await tx.productImage.deleteMany({ where: { productId } });
      if (data.images?.length) {
        await tx.productImage.createMany({
          data: data.images.map((img: ProductImage, idx: number) => ({
            productId,
            url: img.url,
            alt: img.alt || "",
            order: idx,
          })),
        });
      }

      // 3. Özellikler
      await tx.productProperty.deleteMany({ where: { productId } });
      if (data.properties?.length) {
        await tx.productProperty.createMany({
          data: data.properties.map((p: ProductProperty) => ({
            productId,
            propertyTypeId: p.propertyTypeId,
            propertyValueId: p.propertyValueId,
          })),
        });
      }

      // 4. Varyantlar
      await tx.productVariantAttribute.deleteMany({
        where: { variant: { productId } },
      });
      await tx.variantImage.deleteMany({
        where: { variant: { productId } },
      });
      await tx.productVariant.deleteMany({
        where: { productId },
      });

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
  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}
