"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2"; // sweetalert2 kullanıyoruz

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    images?: { url: string }[];
    isFavorite?: boolean;
    variants?: { id: string; name: string; price: number; value: string }[]; // opsiyonel varyantlar
  };
  onRemove?: (id: string) => Promise<void>; // wishlist'te X butonu async
  onToggleFavorite?: (id: string) => Promise<void>; // kalp tıklama async
  onAddToCart?: (id: string) => Promise<void>; // sepete ekle async
}

export const ProductCard = ({
  product,
  onRemove,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) => {
  const [favorite, setFavorite] = useState(product.isFavorite ?? false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const handleToggleFavorite = async () => {
    if (!onToggleFavorite || loadingFavorite) return;

    setLoadingFavorite(true);
    try {
      setFavorite(!favorite);
      await onToggleFavorite(product.id);
      Swal.fire({
        icon: "success",
        title: favorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setFavorite(favorite); // revert
      Swal.fire({
        icon: "error",
        title: "Hata oluştu",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove || loadingRemove) return;

    setLoadingRemove(true);
    try {
      await onRemove(product.id);
      Swal.fire({
        icon: "success",
        title: "Ürün kaldırıldı",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Hata oluştu",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoadingRemove(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {onRemove && (
        <button
          onClick={handleRemove}
          disabled={loadingRemove}
          className={`absolute top-2 right-2 z-10 p-1 rounded-full transition-colors ${
            loadingRemove
              ? "cursor-not-allowed opacity-50"
              : "bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          disabled={loadingFavorite}
          className={`absolute top-2 left-2 z-10 p-1 rounded-full transition-colors ${
            loadingFavorite ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <Heart
            className={`w-5 h-5 ${favorite ? "text-red-500" : "text-white dark:text-gray-300"} drop-shadow-md`}
            fill={favorite ? "currentColor" : "none"}
          />
        </button>
      )}

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

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-pink-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          ₺{product.price}
        </p>
      </div>
    </div>
  );
};
