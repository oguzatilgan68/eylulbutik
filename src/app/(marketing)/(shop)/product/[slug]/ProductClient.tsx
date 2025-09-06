"use client";

import { useState } from "react";
import Image from "next/image";
import Reviews from "@/app/(marketing)/components/product/Reviews";
import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import { toPriceString } from "@/app/(marketing)/lib/money";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Ürün Görselleri */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col gap-4">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={600}
              height={600}
              priority
              className="rounded-2xl object-cover w-full h-[400px] lg:h-[500px]"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-800 w-full h-[400px] flex items-center justify-center rounded-2xl text-gray-600 dark:text-gray-300">
              Görsel Yok
            </div>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold dark:text-white">
              {product.name}
            </h1>
            <WishlistButton productId={product.id} />
          </div>

          {product.brand && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Marka: {product.brand.name}
            </p>
          )}
          {product.category && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Kategori: {product.category.name}
            </p>
          )}

          {/* Eğer ürünün varyantları varsa seçim alanı */}
          {product.variants?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold dark:text-white mb-2">
                Varyasyon Seç
              </h3>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`px-4 py-2 rounded-xl border ${
                      selectedVariant === v.id
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-800 dark:text-gray-100 text-xl">
            ₺{toPriceString(product.price)}
          </p>

          {product.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          )}

          <AddToCartButton
            productId={product.id}
            variantId={product.variants?.length > 0 ? selectedVariant : null}
            disabled={product.variants?.length > 0 && !selectedVariant}
          />
        </div>
      </div>

      {/* Ürün Detayları + Yorumlar */}
      <div className="mt-12 grid gap-10">
        <section>
          <h2 className="text-2xl font-semibold dark:text-white mb-4">
            Ürün Detayları
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description ||
              "Bu ürün için detaylı bilgi bulunmamaktadır."}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold dark:text-white mb-4">
            Yorumlar
          </h2>
          <Reviews productId={product.id} />
        </section>
      </div>
    </div>
  );
}
