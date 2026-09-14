import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { generateUniqueSlug } from "./generate-slug";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

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
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { ids } = body; // string[] (silinecek ürün ID'leri)

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Silinecek ürün seçilmedi." }, { status: 400 });
    }

    // 🚀 Transaction ile seçilen ürünlere bağlı tüm alt tabloları temizleyip güvenle siliyoruz
    await db.$transaction(async (tx) => {
      // 1. Bu ürünlere ait varyant ID'lerini bulalım
      const variants = await tx.productVariant.findMany({
        where: { productId: { in: ids } },
        select: { id: true },
      });
      const variantIds = variants.map((v) => v.id);

      // 2. Sepet öğelerinden (CartItem) bu ürünlere/varyantlara ait olanları temizle
      await tx.cartItem.deleteMany({
        where: {
          OR: [
            { productId: { in: ids } },
            ...(variantIds.length > 0 ? [{ variantId: { in: variantIds } }] : []),
          ],
        },
      });

      // 3. Siparişi verilmiş ürünler varsa engelle
      const orderItemCount = await tx.orderItem.count({
        where: {
          OR: [
            { productId: { in: ids } },
            ...(variantIds.length > 0 ? [{ variantId: { in: variantIds } }] : []),
          ],
        },
      });

      if (orderItemCount > 0) {
        throw new Error("Seçilen ürünlerden biri veya birkaçı daha önce satın alındığı (sipariş geçmişi olduğu) için silinemez.");
      }

      // 4. Varyant alt ilişkilerini temizle
      if (variantIds.length > 0) {
        await tx.productVariantAttribute.deleteMany({
          where: { variantId: { in: variantIds } },
        });
        await tx.variantImage.deleteMany({
          where: { variantId: { in: variantIds } },
        });
        await tx.productVariant.deleteMany({
          where: { productId: { in: ids } },
        });
      }

      // 5. Ürünün görsellerini, özelliklerini (ProductProperty), yorumlarını ve wishlist bağlarını temizle
      await tx.productImage.deleteMany({ where: { productId: { in: ids } } });
      await tx.productProperty.deleteMany({ where: { productId: { in: ids } } });
      await tx.review.deleteMany({ where: { productId: { in: ids } } });

      // Wishlist ve Slider M-N ilişkilerini koparalım
      for (const id of ids) {
        await tx.product.update({
          where: { id },
          data: {
            wishlists: { set: [] },
            sliders: { set: [] },
          },
        });
      }

      // 6. Artık ürünleri güvenle silebiliriz
      await tx.product.deleteMany({
        where: { id: { in: ids } },
      });
    });

    return NextResponse.json({ success: true, message: "Seçilen ürünler başarıyla silindi." });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Toplu ürün silme hatası:", error);
    return NextResponse.json(
      { error: error.message || "Ürünler silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const data = await req.json();
    if (!data.name || !data.categoryId) {
      return NextResponse.json(
        { error: "Ürün adı ve kategori zorunludur." },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(data.name);

    // Tüm işlemler tek bir transaction içinde güvenle yürütülüyor
    const product = await db.$transaction(async (tx) => {
      // 1. Ürünü oluştur
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          slug,
          price: Number(data.price) || 0,
          categoryId: data.categoryId,
          brandId: data.brandId || undefined,
          status: data.status || "DRAFT",
          inStock: data.inStock ?? true,
          modelSize: data.modelSize || undefined,
          modelInfoId: data.modelInfoId || undefined,
          seoTitle: data.seoTitle || undefined,
          seoKeywords: Array.isArray(data.seoKeywords)
            ? data.seoKeywords
            : data.seoKeywords
            ? data.seoKeywords.split(",").map((k: string) => k.trim())
            : [],
          changeable: data.changeable ?? true,
        },
      });

      // 2. Ana Ürün Görselleri
      if (Array.isArray(data.images) && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img: any, idx: number) => ({
            productId: newProduct.id,
            url: img.url,
            alt: img.alt || "",
            order: idx,
          })),
        });
      }

      // 3. Varyantlar ve Varyant Detayları
      if (Array.isArray(data.variants) && data.variants.length > 0) {
        for (const v of data.variants) {
          const variant = await tx.productVariant.create({
            data: {
              productId: newProduct.id,
              sku: v.sku || undefined,
              price: Number(v.price) || 0,
              stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
            },
          });

          if (Array.isArray(v.images) && v.images.length > 0) {
            await tx.variantImage.createMany({
              data: v.images.map((img: any, idx: number) => ({
                variantId: variant.id,
                url: img.url,
                alt: img.alt || "",
                order: idx,
              })),
            });
          }

          if (Array.isArray(v.attributeValueIds) && v.attributeValueIds.length > 0) {
            await tx.productVariantAttribute.createMany({
              data: v.attributeValueIds.map((attrId: string) => ({
                variantId: variant.id,
                attributeValueId: attrId,
              })),
              skipDuplicates: true,
            });
          }
        }
      }

      // 4. Properties (Özellikler)
      if (Array.isArray(data.properties) && data.properties.length > 0) {
        await tx.productProperty.createMany({
          data: data.properties.map((p: any) => ({
            productId: newProduct.id,
            propertyTypeId: p.propertyTypeId,
            propertyValueId: p.propertyValueId,
          })),
          skipDuplicates: true,
        });
      }

      return newProduct;
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json(
      { error: error.message || "Ürün oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}