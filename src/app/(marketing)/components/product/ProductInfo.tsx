"use client";

import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";
import { toPriceString } from "@/app/(marketing)/lib/money";
import { FiCheckCircle, FiAlertCircle, FiShield, FiTruck } from "react-icons/fi";

export default function ProductInfo({
  product,
  selectedVariant,
  displayPrice,
  inStock,
}: any) {
  return (
    <div className="space-y-6">
      {/* Marka & Kategori Rozetleri */}
      <div className="flex items-center justify-between">
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
        <WishlistButton productId={product.id} />
      </div>

      {/* Ürün Adı */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Fiyat ve Stok Durumu */}
      <div className="flex items-baseline justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
        <div>
          <span className="text-3xl font-black text-pink-600 dark:text-pink-400 tracking-tight">
            ₺{toPriceString(displayPrice)}
          </span>
          <span className="text-xs text-gray-400 ml-1 font-medium">(KDV Dahil)</span>
        </div>

        <div>
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <FiCheckCircle size={14} /> Stokta Var
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-100 dark:border-rose-900/30">
              <FiAlertCircle size={14} /> Tükendi
            </span>
          )}
        </div>
      </div>

      {/* Sepete Ekle Butonu */}
      <div className="pt-2">
        <AddToCartButton
          productId={product.id}
          variantId={selectedVariant?.id || null}
          disabled={!inStock}
        />
      </div>

      {/* Güvence Rozetleri */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
          <FiTruck className="text-pink-600 shrink-0" size={18} />
          <span>Hızlı ve Güvenli Kargo</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
          <FiShield className="text-pink-600 shrink-0" size={18} />
          <span>Güvenli Alışveriş / İade</span>
        </div>
      </div>
    </div>
  );
}