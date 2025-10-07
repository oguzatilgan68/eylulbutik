"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderSummary from "../../components/ui/OrderSummary";

interface CartItem {
  id: string;
  product: {
    name: string;
    images: { url: string }[];
    slug: string;
  };
  variant?: {
    attributes: {
      id: string;
      value: string;
      attributeType?: { id: string; name: string };
    }[];
  } | null;
  qty: number;
  unitPrice: number | string; // string gelebilir
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sepeti çek
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Beklenmeyen hata oluştu");
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err) {
        console.error("Sepet alınırken hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [router]);

  // Ara toplam hesapla
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = Number(item.unitPrice) || 0;
      return acc + price * item.qty;
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  // Miktar güncelle
  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    setLoading(true);
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId: itemId, action: "update", qty }),
      });
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, qty } : i))
      );
    } finally {
      setLoading(false);
    }
  };

  // Ürün sil
  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId: itemId, action: "remove" }),
      });
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } finally {
      setLoading(false);
    }
  };

  const buttonClass =
    "w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition cursor-pointer";
  const qtyButtonClass =
    "px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer";

  // Yükleniyor ekranı
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-t-pink-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Sepet boş ekranı
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center xl:h-[30vh] xl:w-[400px] mx-auto sm:h-[60vh] text-center space-y-4 px-4">
        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13l-2-8m5 8v8m4-8v8"
          />
        </svg>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white">
          Sepetiniz Boş
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg">
          Henüz sepetinize ürün eklemediniz.
        </p>
        <Link
          href="/"
          className={`mt-2 px-4 sm:px-6 py-2 text-sm sm:text-base ${buttonClass}`}
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  // Normal sepet ekranı
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
      {/* Sol taraf: Ürünler */}
      <div className="flex-1 space-y-4">
        {cartItems.map((item) => {
          const price = Number(item.unitPrice) || 0;
          const lineTotal = (price * item.qty).toFixed(2);

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow min-h-[140px]"
            >
              <Link href={`/product/${item.product.slug}`}>
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={item.product.name}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </Link>

              <div className="flex-1 w-full sm:w-auto">
                <p className="font-semibold text-lg dark:text-white">
                  {item.product.name}
                </p>
                {item.variant?.attributes?.length ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {item.variant.attributes.map((attr, i) => (
                      <span key={attr.id}>
                        <strong>{attr.attributeType?.name}:</strong>{" "}
                        {attr.value}
                        {i < item.variant!.attributes.length - 1 && " / "}
                      </span>
                    ))}
                  </p>
                ) : null}
                <p className="text-red-500 font-bold text-lg mt-2">
                  {lineTotal} TL
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <button
                    className={qtyButtonClass}
                    onClick={() => updateQty(item.id, item.qty - 1)}
                  >
                    -
                  </button>
                  <span className="font-medium dark:text-white">
                    {item.qty}
                  </span>
                  <button
                    className={qtyButtonClass}
                    onClick={() => updateQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm font-medium hover:underline"
                >
                  Kaldır
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sağ taraf: Özet */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <OrderSummary
          subtotal={subtotal}
          showCheckoutButton={true}
          onApply={(d) => setDiscount(d)}
          onCheckout={() => router.push("/checkout")}
        />
      </div>
    </div>
  );
}
