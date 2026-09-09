"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderStatusSelectProps {
  orderId: string;
  initialStatus: string;
}

export function OrderStatusSelect({
  orderId,
  initialStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);

    try {
      // Önce /api/admin/orders/[id], olmazsa /api/orders/[id] rotasına PATCH atar
      let res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        res = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }

      if (!res.ok) throw new Error("Durum güncellenemedi");

      // Server component verisini anında tazeler
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Bir hata oluştu");
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="orderStatus"
        className="text-xs font-semibold text-gray-500 dark:text-gray-400"
      >
        Sipariş Durumu:
      </label>
      <select
        id="orderStatus"
        disabled={loading}
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="text-xs font-semibold px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition disabled:opacity-50 cursor-pointer text-gray-800 dark:text-gray-100"
      >
        <option value="PENDING">Ödeme Bekleniyor</option>
        <option value="PAID">Ödendi / Hazırlanıyor</option>
        <option value="FULFILLED">Tamamlandı</option>
        <option value="CANCELLED">İptal Edildi</option>
      </select>
      {loading && (
        <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}