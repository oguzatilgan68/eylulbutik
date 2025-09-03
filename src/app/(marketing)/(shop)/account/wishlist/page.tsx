import { ProductCard } from "@/app/(marketing)/components/ui/product/ProductCard";
import { db } from "@/app/(marketing)/lib/db";
import React from "react";

export default async function WishlistPage() {
  const wishlist = await db.wishlist.findFirst({
    where: { userId: "CURRENT_USER_ID" }, // Auth ile değiştirilecek
    include: { products: { include: { images: true, brand: true } } },
  });

  if (!wishlist || wishlist.products.length === 0)
    return <p>Favori ürününüz yok.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {wishlist.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
