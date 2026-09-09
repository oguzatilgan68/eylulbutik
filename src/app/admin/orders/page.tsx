"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import { FiSearch, FiEye, FiShoppingBag } from "react-icons/fi";

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
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/orders?page=${page}&limit=${limit}&search=${search}`
      );
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const totalPages = Math.ceil(total / limit);

  // Sipariş Durumu İçin Şık Renk Rozetleri
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      PENDING: { label: "Beklemede", class: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
      PAID: { label: "Ödendi", class: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
      SHIPPED: { label: "Kargoda", class: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400" },
      COMPLETED: { label: "Tamamlandı", class: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" },
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
    <div className="space-y-6">
      {/* Üst Başlık ve Arama Alanı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiShoppingBag className="text-pink-600" /> Sipariş Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Mağazanıza gelen tüm müşteri siparişlerini buradan takip edebilirsiniz.
          </p>
        </div>

        {/* Arama Kutusu */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Sipariş No veya Müşteri Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tablo Alanı */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5">Sipariş No</th>
                <th className="px-6 py-3.5">Müşteri</th>
                <th className="px-6 py-3.5">Toplam Tutar</th>
                <th className="px-6 py-3.5">Durum</th>
                <th className="px-6 py-3.5">Tarih</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      <span>Siparişler yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      #{order.orderNo}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                      {order.user?.fullName || order.user?.email || "Misafir Kullanıcı"}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {Number(order.total).toFixed(2)} {order.currency || "₺"}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold"
                      >
                        <FiEye size={13} /> Detay
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Henüz sipariş bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}