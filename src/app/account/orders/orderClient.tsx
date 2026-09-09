"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReturnRequestModal from "@/app/(marketing)/components/ui/returnRequestModal";
import { FiShoppingBag, FiClock, FiChevronRight, FiRotateCcw } from "react-icons/fi";

export default function OrdersListClient({ orders }: { orders: any[] }) {
  const [loading, setLoading] = useState(!orders);
  const [openModalOrderId, setOpenModalOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (orders) setLoading(false);
  }, [orders]);

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
        <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-2">
          <FiShoppingBag size={22} />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">Henüz siparişiniz yok</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Koleksiyonumuzu keşfedin ve ilk alışverişinizi hemen gerçekleştirin.
        </p>
      </div>
    );
  }

  const canCreateReturn = (deliveredAt: string) => {
    if (!deliveredAt) return false;
    const orderDate = new Date(deliveredAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 15;
  };

  const getOrderStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      PAID: { label: "Sipariş Alındı", class: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
      FULFILLED: { label: "Tamamlandı", class: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
      SHIPPED: { label: "Kargoda", class: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400" },
      CANCELLED: { label: "İptal Edildi", class: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
    };

    const current = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${current.class}`}>
        {current.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        // DB'den gelen order.total veya satır kalemlerinin toplamı
        const calculatedTotal =
          order.total !== undefined && order.total !== null
            ? Number(order.total)
            : order.items?.reduce(
                (sum: number, item: any) => sum + Number(item.unitPrice) * item.qty,
                0
              ) || 0;

        return (
          <div
            key={order.id}
            className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 sm:p-6 bg-white dark:bg-gray-900 shadow-sm space-y-4 transition-all hover:border-pink-500/30"
          >
            {/* Header / Üst Bilgi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  Sipariş #{order.orderNo}
                </span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <FiClock size={12} />
                  {new Date(order.createdAt).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div>{getOrderStatusBadge(order.status)}</div>
            </div>

            {/* Ürünler Listesi */}
            <ul className="space-y-2 text-sm">
              {order.items?.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                    <span>
                      <strong className="text-gray-900 dark:text-white font-medium">
                        {item.product.name}
                      </strong>{" "}
                      {item.variant?.name ? `(${item.variant.name})` : ""}
                      <span className="text-gray-400 ml-1">x {item.qty}</span>
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white shrink-0">
                    {(Number(item.unitPrice) * item.qty).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </span>
                </li>
              ))}
            </ul>

            {/* Footer / Toplam Tutar ve Aksiyonlar */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-400 font-medium">Toplam Tutar:</span>
                <span className="text-base font-extrabold text-pink-600 dark:text-pink-400">
                  {calculatedTotal.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline"
                >
                  Sipariş Detaylarını Gör <FiChevronRight size={14} />
                </Link>

                {order.status === "FULFILLED" &&
                  canCreateReturn(order.deliveredAt) && (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenModalOrderId(order.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <FiRotateCcw size={13} /> İade Talebi
                      </button>

                      {openModalOrderId === order.id && (
                        <ReturnRequestModal
                          orderId={order.id}
                          orderItems={order.items.map((i: any) => ({
                            id: i.id,
                            name: i.product.name,
                            qty: i.qty,
                            changeable: i.product.changeable,
                            thumbnail:
                              i.variant?.images?.[0]?.url ||
                              i.product.images?.[0]?.url ||
                              undefined,
                          }))}
                          onClose={() => setOpenModalOrderId(null)}
                        />
                      )}
                    </>
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}