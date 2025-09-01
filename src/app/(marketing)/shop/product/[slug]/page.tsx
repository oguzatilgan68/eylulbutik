import React from "react";
import { prisma } from "../../../lib/db";
import { AddToCart } from "../../../components/product/AddToCart";

interface Props {
  params: { slug: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, brand: true, variants: true },
  });

  if (!product) return <p>Ürün bulunamadı</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Ürün görselleri */}
      <div className="space-y-4">
        {product.images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.alt || product.name}
            className="rounded-lg"
          />
        ))}
      </div>

      {/* Ürün bilgileri */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product.brand && (
          <p className="text-gray-500 dark:text-gray-400">
            {product.brand.name}
          </p>
        )}
        <p className="text-xl font-semibold">
          {product.price} {product.currency}
        </p>
        <p>{product.description}</p>

        {/* Variant ve AddToCart */}
        <AddToCart product={product} />
      </div>
    </div>
  );
}
