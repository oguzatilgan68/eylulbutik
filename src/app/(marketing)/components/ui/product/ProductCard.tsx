"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    images?: { url: string }[];
    isFavorite?: boolean;
    variants?: { id: string; name: string; price: number; value: string }[];
  };
  onRemove?: (id: string) => Promise<void>;
  onToggleFavorite?: (id: string) => Promise<void>;
}

export const ProductCard = ({
  product,
  onRemove,
  onToggleFavorite,
}: ProductCardProps) => {
  const [favorite, setFavorite] = useState(product.isFavorite ?? false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleToggleFavorite = async () => {
    if (!onToggleFavorite || loadingFavorite) return;

    setLoadingFavorite(true);
    const nextState = !favorite;
    try {
      setFavorite(nextState);
      await onToggleFavorite(product.id);
      Swal.fire({
        icon: "success",
        title: nextState ? "Favorilere eklendi" : "Favorilerden çıkarıldı",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setFavorite(!nextState); // Hata durumunda geri al
      Swal.fire({
        icon: "error",
        title: "İşlem başarısız oldu",
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
        title: "Kaldırılamadı",
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
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      
      {/* Üst Kaldırma (Silme) Butonu */}
      {onRemove && (
        <button
          onClick={handleRemove}
          disabled={loadingRemove}
          aria-label="Ürünü kaldır"
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all shadow-md ${
            loadingRemove
              ? "cursor-not-allowed opacity-50"
              : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-rose-600 hover:text-white"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Favori Butonu */}
      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          disabled={loadingFavorite}
          aria-label="Favorilere ekle/çıkar"
          className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all shadow-md bg-white/90 dark:bg-gray-800/90 ${
            loadingFavorite ? "cursor-not-allowed opacity-50" : "hover:scale-110"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? "text-rose-600 fill-rose-600" : "text-gray-600 dark:text-gray-300"
            }`}
          />
        </button>
      )}

      {/* Ürün Görseli Alanı (Zoom Efektli) */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        {product.images?.[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            Görsel Yok
          </div>
        )}
      </Link>

      {/* Ürün Bilgileri */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            {Number(product.price).toFixed(2)} <strong className="text-pink-600 font-normal">₺</strong>
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
          >
            İncele →
          </Link>
        </div>
      </div>
    </div>
  );
};