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

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.categoryId) {
      return NextResponse.json(
        { error: "Ürün adı ve kategori zorunludur." },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(data.name);

    // 1️⃣ Ürün oluştur
    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        price: data.price ? new Decimal(data.price) : new Decimal(0),
        description: data.description || undefined,
        category: { connect: { id: data.categoryId } },
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
        status: data.status || "DRAFT",
        inStock: data.inStock ?? true,
      },
    });

    // 2️⃣ Görseller ekle
    if (data.images && data.images.length > 0) {
      await db.productImage.createMany({
        data: data.images.map((img: any, idx: number) => ({
          productId: product.id,
          url: img.url,
          alt: img.alt || "",
          order: idx,
        })),
      });
    }

    // 3️⃣ Varyantlar ekle
    if (data.variants && data.variants.length > 0) {
      for (const v of data.variants) {
        const variant = await db.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku || undefined,
            price: v.price ? new Decimal(v.price) : undefined,
            stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
          },
        });

        if (v.images && v.images.length > 0) {
          await db.variantImage.createMany({
            data: v.images.map((img: any, idx: number) => ({
              variantId: variant.id,
              url: img.url,
              alt: img.alt || "",
              order: idx,
            })),
          });
        }

        if (v.attributeValueIds && v.attributeValueIds.length > 0) {
          await db.productVariantAttribute.createMany({
            data: v.attributeValueIds.map((attrId: string) => ({
              variantId: variant.id,
              attributeValueId: attrId,
            })),
          });
        }
      }
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Ürün oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
