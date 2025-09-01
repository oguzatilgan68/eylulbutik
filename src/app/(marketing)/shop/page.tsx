import React from "react";
import Link from "next/link";
import { db } from "../lib/db";
import { ProductCard } from "../components/ui/product/ProductCard";

export default async function ShopPage() {
  const products = await db.product.findMany({
    where: { status: "PUBLISHED" },
    include: { images: true, brand: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Katalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/shop/product/${product.slug}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
