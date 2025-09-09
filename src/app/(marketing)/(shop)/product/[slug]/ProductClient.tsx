"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Reviews from "@/app/(marketing)/components/product/Reviews";
import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import { toPriceString } from "@/app/(marketing)/lib/money";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";

interface ProductClientProps {
  product: any;
}

export default function ProductClient({ product }: ProductClientProps) {
  // Seçilen attribute ve görsel index
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [zoomPos, setZoomPos] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // Mouse hover için zoom pozisyonu
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos((prev) => ({ ...prev, [id]: { x, y } }));
  };

  // Attribute tiplerini ayıkla
  const attributeTypes = useMemo(() => {
    const types: Record<string, string[]> = {};
    product.variants.forEach((variant: any) => {
      variant.attributes.forEach((attr: any) => {
        if (!types[attr.key]) types[attr.key] = [];
        if (!types[attr.key].includes(attr.value))
          types[attr.key].push(attr.value);
      });
    });
    return types;
  }, [product.variants]);

  // Seçilen attribute kombinasyonuna göre varyant
  const selectedVariant = useMemo(() => {
    return product.variants.find((v: any) =>
      v.attributes.every((a: any) => selectedAttributes[a.key] === a.value)
    );
  }, [selectedAttributes, product.variants]);

  // Fiyat ve stok durumu
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const inStock = selectedVariant
    ? selectedVariant.stockQty > 0
    : product.inStock;

  // Görseller
  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Ürün Ana Bölüm */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol: Görseller */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          {/* Ana Görsel */}
          <div
            className="relative w-full aspect-[1/1.2] overflow-hidden rounded-2xl border dark:border-gray-700 group cursor-zoom-in"
            onMouseMove={(e) => handleMouseMove(e, product.id)}
            onMouseLeave={() =>
              setZoomPos((prev) => ({
                ...prev,
                [product.id]: { x: 50, y: 50 },
              }))
            }
          >
            {images?.[selectedImageIdx] ? (
              <Image
                src={images[selectedImageIdx].url}
                alt={product.name}
                fill
                className="object-cover w-full h-full transition-transform duration-200 ease-out group-hover:scale-150"
                style={{
                  transformOrigin: `${zoomPos[product.id]?.x ?? 50}% ${
                    zoomPos[product.id]?.y ?? 50
                  }%`,
                }}
              />
            ) : (
              <div className="bg-gray-200 dark:bg-gray-800 w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                Görsel Yok
              </div>
            )}
          </div>

          {/* Thumbnail Slider */}
          <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIdx === idx
                    ? "border-pink-500 shadow-md"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="object-cover w-14 h-14"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sağ: Ürün Bilgileri */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white leading-tight">
              {product.name}
            </h1>
            <WishlistButton productId={product.id} />
          </div>

          {/* Marka & Kategori */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300">
            {product.brand && <span>Marka: {product.brand.name}</span>}
            {product.category && <span>Kategori: {product.category.name}</span>}
          </div>

          {/* Attribute Seçimi */}
          {Object.entries(attributeTypes).map(([key, values]) => (
            <div key={key} className="mt-2">
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
                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                      selectedAttributes[key] === val
                        ? "bg-pink-500 text-white border-pink-500 shadow-md"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Fiyat ve Stok */}
          <p className="text-2xl font-semibold text-pink-600 dark:text-pink-400">
            ₺{toPriceString(displayPrice)}
          </p>
          {!inStock && <p className="text-red-500 text-sm">Stokta Yok</p>}

          {/* Ürün Açıklaması */}
          {product.description && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Sepete Ekle */}
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

      {/* Ürün Detayları & Yorumlar */}
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
