import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.length < 3) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, name: true, slug: true },
    }),
    db.category.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return NextResponse.json({ products, categories });
}
