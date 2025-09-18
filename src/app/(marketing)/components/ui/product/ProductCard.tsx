"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/(marketing)/components/ui/button";
import { Heart, X } from "lucide-react";
import { useState } from "react";
import { redirect } from "next/navigation";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    images?: { url: string }[];
    isFavorite?: boolean; // 👈 favori durumu
  };
  onRemove?: (id: string) => void; // wishlist'te X butonu
  onToggleFavorite?: (id: string) => void; // kalp tıklama
}

export const ProductCard = ({
  product,
  onRemove,
  onToggleFavorite,
}: ProductCardProps) => {
  const [favorite, setFavorite] = useState(product.isFavorite ?? false);

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    if (onToggleFavorite) onToggleFavorite(product.id);
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* X butonu (wishlist'ten kaldırma) */}
      {onRemove && (
        <button
          onClick={() => onRemove(product.id)}
          className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-700 p-1 rounded-full shadow hover:bg-red-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Favori kalp */}
      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 left-2 z-10 p-1 rounded-full transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              favorite ? "text-red-500" : "text-white dark:text-gray-300"
            } drop-shadow-md`}
            fill={favorite ? "currentColor" : "none"}
          />
        </button>
      )}

      {/* Ürün görseli */}
      <Link href={`/product/${product.slug}`} className="block relative">
        {product.images?.[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover"
            priority
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            Görsel Yok
          </div>
        )}
      </Link>

      {/* Ürün bilgisi */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-pink-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          ₺{product.price}
        </p>

        {/* Sepete Ekle butonu */}
        <Button
          onClick={() => redirect("/product/" + product.slug)}
          className="mt-2 w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          Sepete Ekle
        </Button>
      </div>
    </div>
  );
};
