"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  id: string;
  product: {
    name: string;
    images: { url: string }[];
    slug: string;
  };
  variant?: { attributes: any };
  qty: number;
  unitPrice: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [loading, setLoading] = useState(true); // başlangıçta loading true
  const router = useRouter();
  // 1️⃣ Sepeti fetch et
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setCartItems(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // 2️⃣ cartItems değiştikçe subtotal ve total'ı hesapla
  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) => acc + item.unitPrice * item.qty,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    setLoading(true);
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        body: JSON.stringify({ cartItemId: itemId, action: "update", qty }),
      });
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, qty } : i))
      );
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        body: JSON.stringify({ cartItemId: itemId, action: "remove" }),
      });
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } finally {
      setLoading(false);
    }
  };
  const redirect = () => {
    router.push("/checkout");
  };
  const applyCoupon = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        body: JSON.stringify({ userId: "me", code: coupon }),
      });
      const data = await res.json();

      if (data.success) {
        setDiscount(data.discount);
        setCouponMessage("Kupon başarıyla uygulandı!");
      } else {
        setDiscount(0);
        setCouponMessage(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const total = subtotal - discount;
  const buttonClass =
    "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer";
  const bclass =
    "px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer";
  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-t-pink-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  if (cartItems.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <svg
          className="w-24 h-24 text-gray-300 dark:text-gray-600"
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
        <h2 className="text-2xl font-bold dark:text-white">Sepetiniz Boş</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Henüz sepetinize ürün eklemediniz.
        </p>
        <Link href="/" className={`mt-2 px-6 py-2 ${buttonClass}`}>
          Alışverişe Devam Et
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
      {/* Sol: Ürün Listesi */}
      <div className="flex-1 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            {/* Ürün Resmi */}
            <Link href={`/product/${item.product.slug}`}>
              <Image
                src={item.product.images[0]?.url || ""}
                alt={item.product.name}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
            </Link>
            {/* Ürün Bilgileri */}
            <div className="flex-1 w-full sm:w-auto">
              <p className="font-semibold text-lg">{item.product.name}</p>
              {item.variant && (
                <p className="text-gray-500 text-sm">
                  {Object.values(item.variant.attributes).join(" / ")}
                </p>
              )}
              {/* Fiyat */}
              <p className="text-red-500 font-bold text-lg mt-1">
                {(item.unitPrice * item.qty).toFixed(2)} TL
              </p>
            </div>

            {/* Miktar & Kaldır */}
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
              {/* Miktar */}
              <div className="flex items-center gap-2">
                <button
                  className={bclass}
                  onClick={() => updateQty(item.id, Math.max(item.qty - 1, 1))}
                >
                  -
                </button>
                <span className="font-medium">{item.qty}</span>
                <button
                  className={bclass}
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>

              {/* Kaldır */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm font-medium hover:underline cursor-pointer"
              >
                Kaldır
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sağ: Sipariş Özeti */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Sipariş Özeti</h2>
        <p>Ara Toplam: {subtotal.toFixed(2)} TL</p>
        {discount > 0 && <p>İndirim: -{discount.toFixed(2)} TL</p>}
        <p className="font-semibold">Toplam: {total.toFixed(2)} TL</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Kupon kodu"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={applyCoupon}
            className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition cursor-pointer"
          >
            Uygula
          </button>
        </div>
        {couponMessage && (
          <p className="text-sm text-red-500">{couponMessage}</p>
        )}

        <button onClick={redirect} className={buttonClass}>
          Ödeme Yap
        </button>
      </div>
    </div>
  );
}
