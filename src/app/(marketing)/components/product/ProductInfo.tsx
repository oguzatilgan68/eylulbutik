"use client";

import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";
import { toPriceString } from "@/app/(marketing)/lib/money";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function ProductInfo({
  product,
  selectedVariant,
  displayPrice,
  inStock,
}: any) {
  return (
    <div className="space-y-6">
      {/* Üst Başlık & Favori Butonu */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
          {product.name}
        </h1>
        <div className="p-2 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-800 shadow-sm">
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Marka & Kategori Rozetleri */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {product.brand && (
          <span className="px-3 py-1 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/50">
            {product.brand.name}
          </span>
        )}
        {product.category && (
          <span className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Fiyat ve Stok Durumu */}
      <div className="space-y-2 p-4 rounded-2xl bg-gray-50/60 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
            ₺{toPriceString(displayPrice)}
          </span>
          <span className="text-xs text-gray-400 font-medium">(KDV Dahil)</span>
        </div>

        <div>
          {inStock ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              <FiCheckCircle size={14} /> Stokta Mevcut
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg">
              <FiAlertCircle size={14} /> Ürün Tükendi
            </div>
          )}
        </div>
      </div>

      {/* Sepete Ekle Butonu Alanı */}
      <div className="pt-2">
        <AddToCartButton
          productId={product.id}
          variantId={selectedVariant?.id || null}
          disabled={!inStock}
        />
      </div>
    </div>
  );
}