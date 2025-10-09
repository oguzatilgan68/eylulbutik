"use client";

import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";
import { toPriceString } from "@/app/(marketing)/lib/money";

export default function ProductInfo({
  product,
  selectedVariant,
  displayPrice,
  inStock,
}: any) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white leading-tight">
          {product.name}
        </h1>
        <WishlistButton productId={product.id} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300">
        {product.brand && <span>Marka: {product.brand.name}</span>}
        {product.category && <span>Kategori: {product.category.name}</span>}
      </div>

      <div>
        <p className="text-2xl font-semibold text-pink-600 dark:text-pink-400">
          ₺{toPriceString(displayPrice)}
        </p>
        {!inStock && <p className="text-red-500 text-sm">Stokta Yok</p>}
      </div>

      <AddToCartButton
        productId={product.id}
        variantId={selectedVariant?.id || null}
        disabled={!inStock}
      />
    </>
  );
}
