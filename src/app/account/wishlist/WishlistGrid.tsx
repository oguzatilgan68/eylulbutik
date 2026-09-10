"use client";

import { ProductCard } from "@/app/(marketing)/components/ui/product/ProductCard";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function WishlistGrid({
  products: initialProducts,
  userId,
}: {
  products: any[];
  userId: string;
}) {
  const [products, setProducts] = useState(initialProducts);

  const handleRemove = async (productId: string) => {
    // ProductCard kendi içinde zaten Swal ile onay alıp başarı mesajı gösterdiği için 
    // burada sadece API isteğini atıp state'i güncelliyoruz.
    const res = await fetch("/api/wishlist/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });

    if (!res.ok) throw new Error("Kaldırılamadı");

    // Listeden ürünü anında düşürüyoruz
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  if (!products || products.length === 0) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-inner">
          <Heart size={28} className="fill-pink-500/20" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Favori Listeniz Boş
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Henüz favorilerinize ürün eklemediniz. Beğendiğiniz ürünlerin üzerindeki kalp ikonuna tıklayarak burada toplayabilirsiniz.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all mt-2"
        >
          <ShoppingBag size={16} /> Koleksiyonu Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Üst Bilgi Rozeti */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Heart className="text-pink-600 fill-pink-600" size={20} /> Favori Ürünlerim
        </h1>
        <span className="text-xs font-semibold px-3 py-1 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl">
          {products.length} Ürün
        </span>
      </div>

      {/* Responsive Ürün Grid Düzeni */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}