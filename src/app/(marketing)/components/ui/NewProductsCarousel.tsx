"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NewProductsCarousel() {
  const { data, error, isLoading } = useSWR<{ products: Product[] }>(
    "/api/new-products",
    fetcher
  );
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data?.products) setProducts(data.products);
  }, [data]);

  if (error) return <p className="text-red-500 px-4">Ürünler yüklenemedi.</p>;

  return (
    <section className="md:hidden py-4 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 px-4 relative inline-block">
        Yeni Gelenler
        <span className="absolute left-4 -bottom-1 w-12 h-0.5 bg-red-500 rounded"></span>
      </h1>

      <div className="flex overflow-x-auto space-x-4 px-4 mt-3 scrollbar-hide">
        {isLoading || !products.length
          ? // 💨 Skeleton Loader (placeholder)
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-24 md:w-32 flex flex-col items-center animate-pulse"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="mt-2 h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="mt-1 h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))
          : // ✅ Gerçek ürün listesi
            products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="flex-shrink-0 w-24 md:w-32"
                title={product.name}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={112}
                      height={112}
                      sizes="(max-width: 768px) 80px, 112px"
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-800 dark:text-gray-100 truncate w-full">
                    {product.name}
                  </p>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {(Number(product.price) || 0).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
