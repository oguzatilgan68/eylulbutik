"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

import { toPriceString } from "@/app/(marketing)/lib/money";
import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";
import Reviews from "@/app/(marketing)/components/ui/product/tabs/Reviews";
import InstallmentTab from "@/app/(marketing)/components/ui/product/tabs/InstallmentTab";
import ReturnTab from "@/app/(marketing)/components/ui/product/tabs/ReturnTab";
import DetailsTab from "@/app/(marketing)/components/ui/product/tabs/DetailsTab";
import ModelTab from "@/app/(marketing)/components/ui/product/tabs/ModelTab";

// Sekmeler
const TABS = [
  { key: "details", label: "Ürün Özellikleri" },
  { key: "model", label: "Model Bilgileri" },
  { key: "reviews", label: "Yorumlar" },
  { key: "installment", label: "Taksit Seçenekleri" },
  { key: "return", label: "İade Koşulları" },
];

export default function ProductClient({ product }: any) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [zoomPos, setZoomPos] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [activeTab, setActiveTab] = useState<string>("details");

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

  // İlk varyasyonu otomatik seç
  useEffect(() => {
    if (product.variants.length > 0) {
      const firstVariantAttributes: Record<string, string> = {};
      product.variants[0].attributes.forEach((attr: any) => {
        firstVariantAttributes[attr.key] = attr.value;
      });
      setSelectedAttributes(firstVariantAttributes);
      setSelectedImageIdx(0); // ilk varyasyon görseli
    }
  }, [product.variants]);

  // Seçilen varyant
  const selectedVariant = useMemo(() => {
    return product.variants.find((v: any) =>
      v.attributes.every((a: any) => selectedAttributes[a.key] === a.value)
    );
  }, [selectedAttributes, product.variants]);

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const inStock = selectedVariant
    ? selectedVariant.stockQty > 0
    : product.inStock;
  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos((prev) => ({ ...prev, [id]: { x, y } }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Ürün Ana Bölüm */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol Görseller */}
        <div className="lg:w-5/12 flex flex-col gap-4">
          <div
            className="relative w-full max-h-[500px] aspect-[3/4] overflow-hidden rounded-xl border dark:border-gray-700 group cursor-zoom-in"
            onMouseMove={(e) => handleMouseMove(e, product.id)}
            onMouseLeave={() =>
              setZoomPos((prev) => ({
                ...prev,
                [product.id]: { x: 50, y: 50 },
              }))
            }
          >
            {images[selectedImageIdx] ? (
              <Image
                src={images[selectedImageIdx].url}
                alt={product.name}
                fill
                className="object-cover w-full h-full transition-transform duration-300 ease-out group-hover:scale-105"
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

          {/* Thumbnail */}
          <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImageIdx === idx
                    ? "border-pink-500 shadow-md"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  width={100}
                  height={80}
                  className="object-cover w-12 lg:w-20 lg:h-20"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sağ Bilgiler */}
        <div className="lg:w-7/12 flex flex-col gap-6">
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

          <p className="text-2xl font-semibold text-pink-600 dark:text-pink-400">
            ₺{toPriceString(displayPrice)}
          </p>
          {!inStock && <p className="text-red-500 text-sm">Stokta Yok</p>}

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

      {/* Sabit Sekmeler */}
      <div className="mt-12">
        <div className="flex gap-4 border-b dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-4 -mb-px border-b-2 font-semibold transition-all ${
                activeTab === tab.key
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-pink-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 text-gray-700 dark:text-gray-300">
          {activeTab === "details" && (
            <DetailsTab properties={product.properties} />
          )}
          {activeTab === "model" && <ModelTab modelInfo={product.modelInfo} />}
          {activeTab === "reviews" && <Reviews productId={product.id} />}
          {activeTab === "installment" && <InstallmentTab />}
          {activeTab === "return" && <ReturnTab />}
        </div>
      </div>
    </div>
  );
}
