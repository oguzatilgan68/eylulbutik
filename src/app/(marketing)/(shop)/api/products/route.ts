// app/api/products/route.ts
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") || undefined;
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
  const sort = searchParams.get("sort") || "newest"; // newest, price-asc, price-desc

  // Prisma sorgusu
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };

  const products = await db.product.findMany({
    where: {
      status: "PUBLISHED",
      price: { gte: minPrice, lte: maxPrice },
      categoryId: category
        ? (
            await db.category.findUnique({ where: { slug: category } })
          )?.id
        : undefined,
    },
    orderBy,
    include: { images: true },
  });

  return NextResponse.json(products);
}
