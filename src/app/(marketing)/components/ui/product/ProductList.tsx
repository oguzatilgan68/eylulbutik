"use client";

import React, { useEffect, useState, Suspense } from "react";
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

const FilterContent = React.lazy(
  () => import("@/app/(marketing)/components/product/FilterContent")
);

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const limit = 10;

  const fetchProducts = async (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", sort);
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (categorySlug) params.set("category", categorySlug);
    if (Object.keys(selectedAttributes).length > 0)
      params.set("attributes", JSON.stringify(selectedAttributes));
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    if (reset) setProducts(data.products);
    else setProducts((prev) => [...prev, ...data.products]);

    setTotal(data.total);
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(true);
  }, [sort, categorySlug, selectedAttributes]);

  useEffect(() => {
    if (page > 1) fetchProducts(false);
  }, [page]);
  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Sepete eklenemedi");
    } catch (err) {
      console.error("Sepete ekleme hatası:", err);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Sıralama ve Filtreleme Butonları */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="
      flex-1 md:flex-none md:px-4 md:w-auto 
      border border-gray-300 dark:border-gray-700 
      rounded-md py-2 text-sm font-medium 
      dark:bg-gray-800 dark:text-gray-100 
      hover:bg-gray-100 dark:hover:bg-gray-700 
      transition text-center
    "
        >
          Filtrele
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="flex-1 md:flex-none md:w-auto border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-sm font-medium dark:bg-gray-800 dark:text-gray-100 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition"
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

      {/* Ürünler */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <ProductCard
                onAddToCart={handleAddToCart}
                key={p.id}
                product={p}
              />
            ))}
          </div>

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

      {/* Filtre Menüsü */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsFilterOpen(false)}
          />

          <Suspense
            fallback={<div className="text-center p-4">Yükleniyor...</div>}
          >
            <FilterContent
              attributeTypes={attributeTypes}
              selectedAttributes={selectedAttributes}
              setSelectedAttributes={setSelectedAttributes}
              onClose={() => setIsFilterOpen(false)}
            />
          </Suspense>
        </>
      )}
    </div>
  );
};
