"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  categorySlug?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
}

export const ProductList: React.FC<ProductListProps> = ({ categorySlug }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState("latest");
  const [inStock, setInStock] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (sort) params.set("sort", sort);
      if (inStock) params.set("inStock", inStock);
      if (categorySlug) params.set("category", categorySlug);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [sort, inStock, categorySlug]);

  return (
    <div>
      {/* Filtre & Sıralama */}
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
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Stokta:</label>
          <select
            className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100"
            value={inStock}
            onChange={(e) => setInStock(e.target.value)}
          >
            <option value="all">Tümü</option>
            <option value="true">Var</option>
            <option value="false">Yok</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-300">Yükleniyor...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price.toString(),
                images: p.images.map((img) => ({ url: img.url })),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
