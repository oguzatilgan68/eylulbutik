import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export interface ProductUpdateBody {
  name?: string;
  price?: string;
  sku?: string;
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
  seoTitle?: string;
  seoKeywords?: string[] | string;
  changeable?: boolean;
}

/* -------------------- GET -------------------- */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const params = await props.params;
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
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error(err);
    return NextResponse.json({ error: "Ürün alınamadı" }, { status: 500 });
  }
}

/* -------------------- DELETE -------------------- */
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const params = await props.params;
    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Ürün silinirken hata oluştu" },
      { status: 500 }
    );
  }
}

/* -------------------- PATCH -------------------- */
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const params = await props.params;
    const productId = params.id;
    const data: ProductUpdateBody = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: "Güncellenecek veri yok." },
        { status: 400 }
      );
    }

    await db.$transaction(async (tx) => {
      /* 1️⃣ Ürün güncelleme */
      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          price: data.price ? Number(data.price) : undefined,
          categoryId: data.categoryId,
          brandId: data.brandId || undefined,
          status: data.status ? (data.status as any) : undefined,
          inStock: data.inStock,
          modelInfoId: data.modelInfoId || undefined,
          modelSize: data.modelSize || undefined,

          seoTitle: data.seoTitle || undefined,
          seoKeywords: Array.isArray(data.seoKeywords)
            ? data.seoKeywords
            : data.seoKeywords
              ? data.seoKeywords.split(",").map((k) => k.trim())
              : [],
          changeable: data.changeable ?? true,
        },
      });

      /* 2️⃣ Görseller sıfırla ve yeniden ekle */
      await tx.productImage.deleteMany({ where: { productId } });
      if (data.images?.length) {
        await tx.productImage.createMany({
          data: data.images.map((img, idx) => ({
            productId,
            url: img.url,
            alt: img.alt || "",
            order: idx,
          })),
        });
      }

      /* 3️⃣ Özellikler sıfırla ve yeniden ekle */
      await tx.productProperty.deleteMany({ where: { productId } });
      if (data.properties?.length) {
        await tx.productProperty.createMany({
          data: data.properties.map((p) => ({
            productId,
            propertyTypeId: p.propertyTypeId,
            propertyValueId: p.propertyValueId,
          })),
        });
      }

      /* 4️⃣ Variantları sıfırla ve yeniden ekle */
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
              price: v.price ? Number(v.price) : 0,
              stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
            },
          });

          if (v.images?.length) {
            await tx.variantImage.createMany({
              data: v.images.map((img, idx) => ({
                variantId: variant.id,
                url: img.url,
                alt: img.alt || "",
                order: idx,
              })),
            });
          }

          if (v.attributeValueIds?.length) {
            await tx.productVariantAttribute.createMany({
              data: v.attributeValueIds.map((attrId) => ({
                variantId: variant.id,
                attributeValueId: attrId,
              })),
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Product update error:", err);
    return NextResponse.json(
      { error: "Ürün güncellenemedi." },
      { status: 500 }
    );
  }
}