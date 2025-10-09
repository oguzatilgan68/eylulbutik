"use client";

import { ProductCard } from "@/app/(marketing)/components/ui/product/ProductCard";
import { useState } from "react";

export default function WishlistGrid({
  products: initialProducts,
  userId,
}: {
  products: any[];
  userId: string;
}) {
  const [products, setProducts] = useState(initialProducts);

  const handleRemove = async (productId: string) => {
    await fetch("/api/wishlist/remove", {
      method: "POST",
      body: JSON.stringify({ userId, productId }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
