"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Reviews from "@/app/(marketing)/components/product/Reviews";
import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import { toPriceString } from "@/app/(marketing)/lib/money";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";

export default function ProductClient({ product }: { product: any }) {
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);

  // Attribute tiplerini ayıkla
  const attributeTypes = useMemo(() => {
    const types: { [key: string]: string[] } = {};
    product.variants.forEach((v: any) => {
      v.attributes.forEach((a: any) => {
        if (!types[a.key]) types[a.key] = [];
        if (!types[a.key].includes(a.value)) types[a.key].push(a.value);
      });
    });
    return types;
  }, [product.variants]);

  // Seçilen attribute combination ile varyant bul
  const selectedVariant = useMemo(() => {
    return product.variants.find((v: any) =>
      v.attributes.every((a: any) => selectedAttributes[a.key] === a.value)
    );
  }, [selectedAttributes, product.variants]);

  // Gösterilecek fiyat ve stok
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const inStock = selectedVariant
    ? selectedVariant.stockQty > 0
    : product.inStock;

  // Gösterilecek görseller
  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Görseller */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden">
            {images?.[selectedImageIdx] ? (
              <Image
                src={images[selectedImageIdx].url}
                alt={product.name}
                width={600}
                height={600}
                priority
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl"
              />
            ) : (
              <div className="bg-gray-200 dark:bg-gray-800 w-full h-[400px] flex items-center justify-center rounded-2xl text-gray-600 dark:text-gray-300">
                Görsel Yok
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`border rounded-lg overflow-hidden ${
                  selectedImageIdx === idx
                    ? "border-pink-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="object-cover w-16 h-16"
                />
              </button>
            ))}
          </div>
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

          {/* Attribute seçimi */}
          {Object.entries(attributeTypes).map(([key, values]) => (
            <div key={key} className="mt-4">
              <h4 className="text-sm font-semibold dark:text-white mb-2">
                {key}
              </h4>
              <div className="flex gap-2 flex-wrap">
                {values.map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setSelectedAttributes((prev) => ({ ...prev, [key]: val }))
                    }
                    className={`px-4 py-2 rounded-xl border ${
                      selectedAttributes[key] === val
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <p className="text-gray-800 dark:text-gray-100 text-xl mt-4">
            ₺{toPriceString(displayPrice)}
          </p>
          {!inStock && <p className="text-red-500 text-sm">Stokta Yok</p>}

          {product.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          )}

          <AddToCartButton
            productId={product.id}
            variantId={selectedVariant?.id || null}
            disabled={
              !inStock ||
              (Object.keys(attributeTypes).length > 0 && !selectedVariant)
            }
          />
        </div>
      </div>

      {/* Detaylar ve Yorumlar */}
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
