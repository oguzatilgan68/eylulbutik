import React from "react";
import { prisma } from "../../../lib/db";
import { ProductCard } from "../../../components/product/ProductCard";

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || "";
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { images: true, brand: true },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Arama Sonuçları: "{query}"</h1>
      {products.length === 0 ? (
        <p>Ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
