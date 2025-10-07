// /api/products/route.ts
import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const sort = searchParams.get("sort") || "latest";
  const inStock = searchParams.get("inStock");
  const category = searchParams.get("category");
  const attributesParam = searchParams.get("attributes");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  let attributes: { [key: string]: string } = {};
  if (attributesParam) attributes = JSON.parse(attributesParam);

  // Filtreleme
  const where: any = {};
  if (inStock === "true") where.inStock = true;
  if (inStock === "false") where.inStock = false;
  if (category) where.category = { slug: category };

  if (Object.keys(attributes).length > 0) {
    where.AND = Object.entries(attributes).map(([key, value]) => ({
      properties: {
        some: {
          propertyType: { name: key },
          propertyValue: { value: value },
        },
      },
    }));
  }

  // Sıralama
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "popular") orderBy = { wishlists: { _count: "desc" } };
  if (sort === "most-favorited") orderBy = { wishlists: { _count: "desc" } };
  if (sort === "best-selling") orderBy = { orderItems: { _count: "desc" } };
  if (sort === "highest-rated") orderBy = { ratingAvg: "desc" };
  if (sort === "most-reviewed") orderBy = { ratingCount: "desc" };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: true,
        brand: true,
        category: true,
        properties: {
          include: {
            propertyType: true,
            propertyValue: true,
          },
        },
        wishlists: true,
        reviews: true,
        _count: {
          select: {
            orderItems: true,
            wishlists: true,
            reviews: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
  ]);
  return NextResponse.json({ products, total });
}
