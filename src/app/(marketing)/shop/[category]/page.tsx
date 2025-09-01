import React from "react";
import { ProductCard } from "../../components/ui/product/ProductCard";
import { db } from "../../lib/db";
interface Props {
  params: { category: string };
}

export default async function CategoryPage({ params }: Props) {
  const category = await db.category.findUnique({
    where: { slug: params.category },
    include: { products: { include: { images: true, brand: true } } },
  });

  if (!category) return <p>Kategori bulunamadı</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{category.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
