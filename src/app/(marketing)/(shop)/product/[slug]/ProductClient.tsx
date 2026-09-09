"use client";

import ProductAttributes from "@/app/(marketing)/components/product/ProductAttributes";
import ProductImages from "@/app/(marketing)/components/product/ProductImages";
import ProductInfo from "@/app/(marketing)/components/product/ProductInfo";
import ProductTabs from "@/app/(marketing)/components/product/ProductTabs";
import { useState, useMemo, useEffect } from "react";

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
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

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

  useEffect(() => {
    if (product.variants.length > 0) {
      const firstVariant: Record<string, string> = {};
      product.variants[0].attributes.forEach((attr: any) => {
        firstVariant[attr.key] = attr.value;
      });
      setSelectedAttributes(firstVariant);
      setSelectedImageIdx(0);
    }
  }, [product.variants]);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((v: any) =>
        v.attributes.every((a: any) => selectedAttributes[a.key] === a.value)
      ),
    [selectedAttributes, product.variants]
  );

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const inStock = selectedVariant
    ? selectedVariant.stockQty > 0
    : product.inStock;
  const images = selectedVariant?.images?.length
    ? selectedVariant.images
    : product.images;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 space-y-12">
      {/* Üst Kısım: Görsel ve Bilgiler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Sol: Görsel Galerisi (Lüks 7 kolon) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
          <ProductImages
            images={images}
            selectedImageIdx={selectedImageIdx}
            setSelectedImageIdx={setSelectedImageIdx}
          />
        </div>

        {/* Sağ: Ürün Bilgileri ve Seçenekler (5 kolon) */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            displayPrice={displayPrice}
            inStock={inStock}
          />
          <hr className="border-gray-100 dark:border-gray-800" />
          <ProductAttributes
            attributeTypes={attributeTypes}
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
          />
        </div>
      </div>

      <ProductTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={TABS}
        product={product}
      />
    </div>
  );
}