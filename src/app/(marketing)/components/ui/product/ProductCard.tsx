"use client";

import React from "react";
import { Product } from "@prisma/client"; // Prisma Product tipi
import { Button } from "../button";
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

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <a href={`/shop/product/${product.slug}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </a>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {product.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mt-1">
          {typeof product.price === "object" && "toString" in product.price
            ? (product.price as Decimal).toString()
            : String(product.price)}{" "}
          TL
        </p>
        <div className="mt-4">
          <Button>
            <a href={`/shop/product/${product.slug}`}>Ürünü Gör</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
