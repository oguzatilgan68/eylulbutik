"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReturnRequestModal from "@/app/(marketing)/components/ui/returnRequestModal";

export default function OrdersListClient({ orders }: { orders: any[] }) {
  const [loading, setLoading] = useState(!orders);
  const [openModalOrderId, setOpenModalOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (orders) setLoading(false);
    console.log(orders, "orders");
  }, [orders]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <p className="p-4 text-gray-600">Henüz siparişiniz bulunmuyor.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded p-4 bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Sipariş No: {order.orderNo}</span>
            <span>
              {order.status === "PAID" ? "Sipariş Verildi" : "Tamamlandı"}
            </span>
          </div>

          <ul className="space-y-1">
            {order.items?.map((item: any) => (
              <li key={item.id}>
                {item.product.name}{" "}
                {item.variant?.name ? `(${item.variant.name})` : ""} x{" "}
                {item.qty} = {(item.unitPrice * item.qty).toFixed(2)} TL
              </li>
            ))}
          </ul>

          <div className="flex gap-4 mt-3">
            <Link
              href={`/account/orders/${order.id}`}
              className="text-blue-600 hover:underline"
            >
              Detayları Gör
            </Link>

            {order.status === "FULFILLED" && (
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
                      changeable: i.product.changeable, // ürün değiştirilebilir mi
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
