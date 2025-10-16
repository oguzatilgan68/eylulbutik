import { db } from "@/app/(marketing)/lib/db";
import { Decimal } from "@/generated/prisma/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { generateUniqueSlug } from "./generate-slug";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const brandId = searchParams.get("brandId") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
    const sortField = searchParams.get("sortField") || "name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
    const where: any = {};
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    if (status) where.status = status;
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;

    if (minPrice || maxPrice) {
      where.OR = where.OR || [];
      where.OR.push({
        variants: {
          some: {
            price: {
              gte: minPrice || undefined,
              lte: maxPrice || undefined,
            },
          },
        },
      });
      where.OR.push({
        price: {
          gte: minPrice || undefined,
          lte: maxPrice || undefined,
        },
      });
    }

    const totalItems = await db.product.count({ where });

    const items = await db.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        images: true,
        variants: true,
      },
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        { error: "Silinecek ürün ID'leri gönderilmedi." },
        { status: 400 }
      );
    }

    await db.product.deleteMany({
      where: { id: { in: body.ids } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Silme işlemi başarısız." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.categoryId) {
      return NextResponse.json(
        { error: "Ürün adı ve kategori zorunludur." },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(data.name);

    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        price: data.price
          ? new Decimal(parseFloat(data.price))
          : new Decimal(0),
        category: { connect: { id: data.categoryId } },
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
        status: data.status || "DRAFT",
        inStock: data.inStock ?? true,
        modelSize: data.modelSize || undefined,
        modelInfo: data.modelInfoId
          ? { connect: { id: data.modelInfoId } }
          : undefined,

        // 🔹 Yeni alanlar
        seoTitle: data.seoTitle || undefined,
        seoKeywords: Array.isArray(data.seoKeywords)
          ? data.seoKeywords
          : data.seoKeywords
            ? data.seoKeywords.split(",").map((k:string) => k.trim())
            : [],
        changeable: data.changeable ?? true,
      },
    });

    // Görseller
    if (Array.isArray(data.images) && data.images.length > 0) {
      await db.productImage.createMany({
        data: data.images.map((img: any, idx: number) => ({
          productId: product.id,
          url: img.url,
          alt: img.alt || "",
          order: idx,
        })),
      });
    }

    // Varyantlar
    if (Array.isArray(data.variants) && data.variants.length > 0) {
      for (const v of data.variants) {
        const variant = await db.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku || undefined,
            price: v.price ? new Decimal(parseFloat(v.price)) : undefined,
            stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
          },
        });

        if (Array.isArray(v.images) && v.images.length > 0) {
          await db.variantImage.createMany({
            data: v.images.map((img: any, idx: number) => ({
              variantId: variant.id,
              url: img.url,
              alt: img.alt || "",
              order: idx,
            })),
          });
        }

        if (
          Array.isArray(v.attributeValueIds) &&
          v.attributeValueIds.length > 0
        ) {
          await db.productVariantAttribute.createMany({
            data: v.attributeValueIds.map((attrId: string) => ({
              variantId: variant.id,
              attributeValueId: attrId,
            })),
          });
        }
      }
    }

    // Properties
    if (Array.isArray(data.properties) && data.properties.length > 0) {
      await db.productProperty.createMany({
        data: data.properties.map((p: any) => ({
          productId: product.id,
          propertyTypeId: p.propertyTypeId,
          propertyValueId: p.propertyValueId,
        })),
      });
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message || "Ürün oluşturulurken bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
