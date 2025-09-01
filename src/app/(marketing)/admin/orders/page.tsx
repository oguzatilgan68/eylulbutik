import React from "react";
import Link from "next/link";
import { db } from "../../lib/db";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Siparişler</h2>

      <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded shadow">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Sipariş No</th>
            <th className="px-4 py-2 text-left">Müşteri</th>
            <th className="px-4 py-2 text-left">Toplam</th>
            <th className="px-4 py-2 text-left">Durum</th>
            <th className="px-4 py-2 text-left">Tarih</th>
            <th className="px-4 py-2 text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2">{order.orderNo}</td>
              <td className="px-4 py-2">
                {order.user?.fullName || order.email}
              </td>
              <td className="px-4 py-2">
                {order.total.toFixed(2)} {order.currency}
              </td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Detay
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
