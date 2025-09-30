"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  categorySlug?: string;
  attributeTypes?: { [key: string]: string[] };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
}

export const ProductList: React.FC<ProductListProps> = ({
  categorySlug,
  attributeTypes = {},
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState("latest");
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchProducts = async (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", sort);
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (categorySlug) params.set("category", categorySlug);
    if (Object.keys(selectedAttributes).length > 0) {
      params.set("attributes", JSON.stringify(selectedAttributes));
    }

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    if (reset) {
      setProducts(data.products);
    } else {
      setProducts((prev) => [...prev, ...data.products]);
    }

    setTotal(data.total);
    setLoading(false);
  };

  // filtre / sıralama değiştiğinde resetle
  useEffect(() => {
    setPage(1);
    fetchProducts(true);
  }, [sort, categorySlug, selectedAttributes]);

  // sayfa arttığında ekle
  useEffect(() => {
    if (page > 1) {
      fetchProducts(false);
    }
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Sıralama */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div>
          <label className="mr-2 font-medium">Sırala:</label>
          <select
            className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Yeni</option>
            <option value="price-asc">Fiyat: Artan</option>
            <option value="price-desc">Fiyat: Azalan</option>
            <option value="popular">Popüler</option>
            <option value="most-favorited">En Çok Favorilenen</option>
            <option value="best-selling">En Çok Satan</option>
            <option value="highest-rated">En Çok Değerlendirilen</option>
          </select>
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex gap-4 mb-6 overflow-x-auto py-2 scrollbar-none">
        {Object.entries(attributeTypes).map(([key, values]) => (
          <div key={key} className="flex-shrink-0 min-w-[160px]">
            <label className="block font-medium text-sm mb-1 dark:text-gray-200">
              {key}
            </label>
            <select
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-100 cursor-pointer"
              value={selectedAttributes[key] || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedAttributes((prev) => {
                  const newAttrs = { ...prev };
                  if (!value) delete newAttrs[key];
                  else newAttrs[key] = value;
                  return newAttrs;
                });
              }}
            >
              <option value="">Tümü</option>
              {values.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Ürünler */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Ürün bulunamadı.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Daha Fazla Butonu */}
          {products.length < total && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Yükleniyor..." : "Daha Fazla Yükle"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
