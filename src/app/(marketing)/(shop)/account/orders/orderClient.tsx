// client component
"use client";
import React, { useState } from "react";
import Link from "next/link";
import ReturnRequestModal from "@/app/(marketing)/components/ui/returnRequestModal";

export default function OrdersListClient({ orders }: { orders: any[] }) {
  const [openModalOrderId, setOpenModalOrderId] = useState<string | null>(null);

  if (orders.length === 0) return <p>Henüz siparişiniz yok.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded p-4 bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Sipariş No: {order.orderNo}</span>
            <span>{order.status}</span>
          </div>

          <ul className="space-y-1">
            {order.items?.map((item: any) => (
              <li key={item.id}>
                {item.product.name} x {item.qty} ={" "}
                {(item.unitPrice * item.qty).toFixed(2)} TL
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
                      name: i.name,
                      qty: i.qty,
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
