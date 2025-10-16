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
  const [zoomPos, setZoomPos] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // Attribute tiplerini memoize et
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
      const firstVariant: Record<string, string> = {};
      product.variants[0].attributes.forEach((attr: any) => {
        firstVariant[attr.key] = attr.value;
      });
      setSelectedAttributes(firstVariant);
      setSelectedImageIdx(0);
    }
  }, [product.variants]);

  // Seçili varyant
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductImages
          images={images}
          selectedImageIdx={selectedImageIdx}
          setSelectedImageIdx={setSelectedImageIdx}
        />
        <div className="flex flex-col gap-6">
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            displayPrice={displayPrice}
            inStock={inStock}
          />
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
