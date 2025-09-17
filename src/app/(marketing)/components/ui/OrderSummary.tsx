// components/OrderSummary.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OrderSummaryProps {
  subtotal: number;
  initialDiscount?: number;
  onApply?: (discount: number, final: number) => void;
  onCheckout?: () => void;
}

export default function OrderSummary({
  subtotal,
  initialDiscount = 0,
  onApply,
  onCheckout,
}: OrderSummaryProps) {
  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(initialDiscount);
  const [finalAmount, setFinalAmount] = useState(subtotal - initialDiscount);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setFinalAmount(subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setMessage("Lütfen kupon kodunu girin");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: coupon.toUpperCase(),
          orderTotal: subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok && data.data) {
        setDiscountAmount(data.data.discount);
        setFinalAmount(data.data.final);
        setMessage("Kupon başarıyla uygulandı!");
        onApply?.(data.data.discount, data.data.final);
      } else {
        setDiscountAmount(0);
        setFinalAmount(subtotal);
        setMessage(data.error || "Kupon uygulanamadı");
        onApply?.(0, subtotal);
      }
    } catch (err) {
      console.error(err);
      setMessage("Sunucu hatası, lütfen tekrar deneyin");
      setDiscountAmount(0);
      setFinalAmount(subtotal);
      onApply?.(0, subtotal);
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscountAmount(0);
    setFinalAmount(subtotal);
    setMessage("Kupon kaldırıldı");
    onApply?.(0, subtotal);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold dark:text-white">Sipariş Özeti</h2>
      <p className="dark:text-gray-200">Ara Toplam: {subtotal.toFixed(2)} TL</p>
      {discountAmount > 0 && (
        <p className="dark:text-gray-200">
          İndirim: -{discountAmount.toFixed(2)} TL
        </p>
      )}
      <p className="font-semibold dark:text-white">
        Toplam: {finalAmount.toFixed(2)} TL
      </p>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Kupon kodu"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="flex-1 border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={applyCoupon}
          className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition"
        >
          Uygula
        </button>
        {discountAmount > 0 && (
          <button
            onClick={removeCoupon}
            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 transition"
          >
            Kaldır
          </button>
        )}
      </div>
      {message && <p className="text-sm text-red-500">{message}</p>}

      <button
        onClick={onCheckout ?? (() => router.push("/checkout"))}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
      >
        Ödeme Yap
      </button>
    </div>
  );
}
