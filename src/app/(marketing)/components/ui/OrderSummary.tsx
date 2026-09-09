"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCoupon } from "../../context/CouponContext";
import { FiTag, FiCheck, FiArrowRight, FiPercent } from "react-icons/fi";

interface OrderSummaryProps {
  subtotal: number;
  onApply?: (discount: number, final: number) => void;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export default function OrderSummary({
  subtotal,
  onApply,
  onCheckout,
  showCheckoutButton = true,
}: OrderSummaryProps) {
  const { coupon, setCoupon, clearCoupon } = useCoupon();
  const [code, setCode] = useState(coupon?.code || "");
  const [discountAmount, setDiscountAmount] = useState(coupon?.discount || 0);
  const [finalAmount, setFinalAmount] = useState(
    coupon?.final || subtotal - (coupon?.discount || 0)
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setFinalAmount(subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const applyCoupon = async () => {
    if (!code.trim()) {
      setMessage("Lütfen kupon kodunu girin.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase(),
          orderTotal: subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok && data.data) {
        setCoupon({
          code: code.toUpperCase(),
          discount: data.data.discount,
          final: data.data.final,
        });
        setDiscountAmount(data.data.discount);
        setFinalAmount(data.data.final);
        setMessage("Kupon başarıyla uygulandı! ✨");
        onApply?.(data.data.discount, data.data.final);
      } else {
        clearCoupon();
        setDiscountAmount(0);
        setFinalAmount(subtotal);
        setMessage(data.error || "Kupon uygulanamadı.");
        onApply?.(0, subtotal);
      }
    } catch (err) {
      console.error(err);
      clearCoupon();
      setDiscountAmount(0);
      setFinalAmount(subtotal);
      setMessage("Sunucu hatası, lütfen tekrar deneyin.");
      onApply?.(0, subtotal);
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    clearCoupon();
    setCode("");
    setDiscountAmount(0);
    setFinalAmount(subtotal);
    setMessage("Kupon kaldırıldı.");
    onApply?.(0, subtotal);
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm uppercase font-mono tracking-wider";

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
        <FiTag className="text-pink-600" /> Sipariş Özeti
      </h2>

      {/* Hesaplama Detayları */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Ara Toplam</span>
          <span className="font-semibold text-gray-900 dark:text-white">{subtotal.toFixed(2)} ₺</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Kampanya İndirimi</span>
            <span>-{discountAmount.toFixed(2)} ₺</span>
          </div>
        )}

        <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-800">
          <span>Toplam Tutar</span>
          <span className="text-pink-600 dark:text-pink-400 text-xl">{finalAmount.toFixed(2)} ₺</span>
        </div>
      </div>

      {/* Kupon Alanı */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          İndirim Kuponu
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Kupon Kodu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={inputClass}
            disabled={discountAmount > 0}
          />
          {discountAmount === 0 ? (
            <button
              type="button"
              onClick={applyCoupon}
              disabled={loading}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-800 text-white hover:bg-pink-600 dark:hover:bg-pink-600 transition-all font-medium text-xs shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Uygula"}
            </button>
          ) : (
            <button
              type="button"
              onClick={removeCoupon}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-600 transition-all font-medium text-xs cursor-pointer shadow-sm"
            >
              Kaldır
            </button>
          )}
        </div>
        {message && (
          <p className={`text-xs font-medium pt-1 ${discountAmount > 0 ? "text-emerald-600" : "text-rose-500"}`}>
            {message}
          </p>
        )}
      </div>

      {/* Ödeme Adımı Butonu */}
      {showCheckoutButton && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onCheckout ?? (() => router.push("/checkout"))}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            Ödeme Adımına Geç <FiArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}