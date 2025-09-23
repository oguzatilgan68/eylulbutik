import React from "react";
import Link from "next/link";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";

export default async function OrdersPage() {
  const userId = await getAuthUserId();
  const orders = await db.order.findMany({
    where: { userId: userId }, // Auth ile değiştirilecek
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
  const breadcrumbItems = [
    { label: "Hesabım", href: "/account" },
    { label: "Siparişlerim", href: "/account/orders" },
  ];
  if (orders.length === 0) return <p>Henüz siparişiniz yok.</p>;

  return (
    <div className="space-y-4">
      <Breadcrumb items={breadcrumbItems} />
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded p-4 bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Sipariş No: {order.orderNo}</span>
            <span>
              {order.status === "CANCELLED"
                ? "İptal Edildi"
                : order.status === "PENDING"
                ? "Beklemede"
                : "Ödendi"}
            </span>
          </div>
          <ul className="space-y-1">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.product.name} x {item.qty} ={" "}
                {(item.unitPrice.toNumber() * item.qty).toFixed(2)} TL
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold">
            Toplam: {order.total.toFixed(2)} TL
          </div>
          <Link
            href={`/account/orders/${order.id}`}
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Detayları Gör
          </Link>
        </div>
      ))}
    </div>
  );
}
