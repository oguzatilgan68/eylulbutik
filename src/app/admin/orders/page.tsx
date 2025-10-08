"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/app/(marketing)/components/ui/Pagination";

interface Order {
  id: string;
  orderNo: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  user?: { fullName?: string; email?: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    const res = await fetch(
      `/api/admin/orders?page=${page}&limit=${limit}&search=${search}`
    );
    const data = await res.json();
    setOrders(data.orders);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h2 className="text-2xl font-bold">Siparişler</h2>

      {/* Arama */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Sipariş No veya Müşteri Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
        />
      </div>

      {/* Responsive Tablo */}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border-collapse text-sm sm:text-base bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "Sipariş No",
                "Müşteri",
                "Toplam",
                "Durum",
                "Tarih",
                "İşlemler",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {order.orderNo}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {order.user?.fullName || order.user?.email || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {Number(order.total).toFixed(2)} {order.currency || "TL"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {order.status}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Detay
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Henüz sipariş bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
