"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Decimal } from "@prisma/client/runtime/library";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number | Decimal;
    images?: { url: string }[];
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || "/placeholder.png";

  const formattedPrice =
    typeof product.price === "object" && "toString" in product.price
      ? (product.price as Decimal).toString()
      : String(product.price);

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <Link href={`/product/${product.slug}`}>
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
            {Number(formattedPrice).toLocaleString("tr-TR")} TL
          </p>
        </div>
      </Link>
    </div>
  );
};
