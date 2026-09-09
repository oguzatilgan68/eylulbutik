"use client";

import React, { useEffect, useState, Suspense } from "react";
import { ProductCard } from "./ProductCard";
import { FiFilter, FiSliders } from "react-icons/fi";

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
    try {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (categorySlug) params.set("category", categorySlug);
      if (Object.keys(selectedAttributes).length > 0)
        params.set("attributes", JSON.stringify(selectedAttributes));
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (reset) setProducts(data.products || []);
      else setProducts((prev) => [...prev, ...(data.products || [])]);

      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(true);
  }, [sort, categorySlug, selectedAttributes]);

  useEffect(() => {
    if (page > 1) fetchProducts(false);
  }, [page]);

  const selectClass =
    "px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm cursor-pointer";

  return (
    <div className="space-y-6">
      {/* Sıralama ve Filtreleme Kontrol Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:bg-pink-100 text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <FiSliders size={15} /> Gelişmiş Filtreleme
          {Object.keys(selectedAttributes).length > 0 && (
            <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-bold">
              {Object.keys(selectedAttributes).length}
            </span>
          )}
        </button>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline">Sırala:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`w-full sm:w-52 ${selectClass}`}
          >
            <option value="latest">En Yeniler</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="popular">En Popülerler</option>
            <option value="most-favorited">En Çok Favorilenenler</option>
            <option value="best-selling">En Çok Satanlar</option>
            <option value="highest-rated">En Çok Değerlendirilenler</option>
          </select>
        </div>
      </div>

      {/* Ürünler Grid / İskelet Durumu */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <p className="text-base font-bold text-gray-900 dark:text-white">
            Aradığınız kriterlere uygun ürün bulunamadı.
          </p>
          <p className="text-xs text-gray-500">
            Filtreleme seçeneklerini değiştirmeyi deneyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {products.length < total && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium text-sm shadow-md shadow-pink-500/20 transition-all disabled:opacity-50 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Yükleniyor..." : "Daha Fazla Ürün Yükle"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filtre Menüsü (Drawer / Modal) */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setIsFilterOpen(false)}
          />

          <Suspense
            fallback={<div className="text-center p-6 text-white">Filtreler yükleniyor...</div>}
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