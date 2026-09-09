"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/generated/prisma";
import NewProductsCarousel from "./NewProductsCarousel";
import SliderComponent from "./Slider";

type Props = {
  categories: Category[];
};

export default function HomePageClient({ categories }: Props) {
  // Ortak kullanılan boyut sınıfı (kod tekrarını önlemek için)
  const containerSizeClass = "w-full h-64 sm:h-80 md:h-96 lg:h-[420px]";

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Üst Karusel ve Banner Alanları */}
      <section className="space-y-6">
        <NewProductsCarousel />
        <SliderComponent />
      </section>

      {/* Kategoriler Bölümü */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kategorileri Keşfet
          </h2>
        </div>

        {safeCategories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              Henüz eklenmiş bir kategori bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {safeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800"
              >
                {category.imageUrl ? (
                  <div className={`relative ${containerSizeClass}`}>
                    <Image
                      src={category.imageUrl}
                      alt={`${category.name} kategorisi`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                ) : (
                  <div
                    className={`${containerSizeClass} bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center`}
                  >
                    <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                      Görsel Yok
                    </span>
                  </div>
                )}

                {/* Şık Karartma Katmanı ve Kategori İsmi */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 flex items-end justify-between">
                  <div>
                    <span className="inline-block text-xs uppercase tracking-widest text-pink-300 font-semibold mb-1">
                      Koleksiyon
                    </span>
                    <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                      {category.name}
                    </h3>
                  </div>

                  {/* Ok İkonu Efekti */}
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}