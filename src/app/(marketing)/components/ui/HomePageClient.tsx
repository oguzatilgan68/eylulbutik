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
  return (
    <div className="py-4">
      <NewProductsCarousel />
      <SliderComponent />
      {categories.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300 text-center">
          Henüz kategori yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {category.imageUrl ? (
                <div className="relative w-full h-64 md:h-80 lg:h-[400px] xl:h-[500px]">
                  <Image
                    src={category.imageUrl}
                    alt={`${category.name} kategorisi`}
                    fill
                    sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, (max-width: 1280px) 33vw,25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-64 md:h-80 lg:h-[400px] xl:h-[500px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-300">
                    Resim yok
                  </span>
                </div>
              )}

              {/* Kategori ismi overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="text-white text-lg md:text-xl lg:text-2xl font-semibold">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
