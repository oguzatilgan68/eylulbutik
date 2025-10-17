"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReturnRequestModal from "@/app/(marketing)/components/ui/returnRequestModal";

export default function OrdersListClient({ orders }: { orders: any[] }) {
  const [loading, setLoading] = useState(!orders);
  const [openModalOrderId, setOpenModalOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (orders) setLoading(false);
  }, [orders]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <p className="p-4 text-gray-600 dark:text-gray-400">
        Henüz siparişiniz bulunmuyor.
      </p>
    );
  }

  const canCreateReturn = (deliveredAt: string) => {
    const orderDate = new Date(deliveredAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 15;
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between mb-2 gap-1 sm:gap-0">
            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
              Sipariş No: {order.orderNo}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(order.createdAt).toLocaleString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {order.status === "PAID" ? "Sipariş Verildi" : "Tamamlandı"}
            </span>
          </div>

          {/* Ürünler */}
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {order.items?.map((item: any) => (
              <li key={item.id}>
                {item.product.name}{" "}
                {item.variant?.name ? `(${item.variant.name})` : ""} x{" "}
                {item.qty} = {(item.unitPrice * item.qty).toFixed(2)} TL
              </li>
            ))}
          </ul>

          {/* Footer / Actions */}
          <div className="flex flex-wrap gap-3 mt-3 text-sm">
            <Link
              href={`/account/orders/${order.id}`}
              className="text-blue-600 hover:underline"
            >
              Detayları Gör
            </Link>

            {order.status === "FULFILLED" &&
              canCreateReturn(order.deliveredAt) && (
                <>
                  <button
                    onClick={() => setOpenModalOrderId(order.id)}
                    className="text-red-600 hover:underline"
                  >
                    İade Talebi Oluştur
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
      ))}
    </div>
  );
}
