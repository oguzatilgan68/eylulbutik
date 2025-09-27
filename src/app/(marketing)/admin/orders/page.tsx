"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  const tableClass =
    "w-full border-collapse bg-white dark:bg-gray-800 rounded shadow";
  const thTdClass = "px-4 py-2 border-b dark:border-gray-700 text-left";

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Siparişler</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Sipariş No veya Müşteri Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      <table className={tableClass}>
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className={thTdClass}>Sipariş No</th>
            <th className={thTdClass}>Müşteri</th>
            <th className={thTdClass}>Toplam</th>
            <th className={thTdClass}>Durum</th>
            <th className={thTdClass}>Tarih</th>
            <th className={thTdClass}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className={thTdClass}>{order.orderNo}</td>
              <td className={thTdClass}>
                {order.user?.fullName || order.user?.email || "-"}
              </td>
              <td className={thTdClass}>{Number(order.total).toFixed(2)} TL</td>
              <td className={thTdClass}>{order.status}</td>
              <td className={thTdClass}>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className={thTdClass}>
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

      {/* Sayfalama */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Önceki
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-2 py-1 border rounded ${
              p === page ? "bg-blue-500 text-white" : ""
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
