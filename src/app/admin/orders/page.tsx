"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import { FiSearch, FiEye, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  // Arama Gecikmesi (Debounce) ile PageSpeed ve Sunucu Yükü Optimizasyonu
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Arama yapıldığında 1. sayfaya dön
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/orders?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`
      );
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Sipariş çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, debouncedSearch]);

  const totalPages = Math.ceil(total / limit);

  // Tümünü Seç / Bırak
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Tekli veya Çoklu Silme Fonksiyonu
  const handleDelete = async (ids: string[]) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: `Seçilen ${ids.length} sipariş kalıcı olarak silinecektir!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silme başarısız");

      Swal.fire({ icon: "success", title: "Silindi!", text: "Siparişler başarıyla kaldırıldı.", timer: 1500, showConfirmButton: false });
      setSelectedIds([]);
      fetchOrders();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Hata!", text: err.message, confirmButtonColor: "#ef4444" });
    }
  };

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Üst Başlık ve Arama Alanı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiShoppingBag className="text-pink-600" /> Sipariş Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Mağazanıza gelen tüm müşteri siparişlerini buradan takip edebilir ve yönetebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => handleDelete(selectedIds)}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FiTrash2 size={14} /> Seçilenleri Sil ({selectedIds.length})
            </button>
          )}

          {/* Arama Kutusu */}
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Sipariş No veya Müşteri Ara..."
              value={search}
              onChange={(e) => startTransition(() => setSearch(e.target.value))}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Tablo Alanı */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-200">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === orders.length && orders.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                  />
                </th>
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
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      <span>Siparişler yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds((prev) => [...prev, order.id]);
                          else setSelectedIds((prev) => prev.filter((id) => id !== order.id));
                        }}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                      />
                    </td>
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold"
                        >
                          <FiEye size={13} /> Detay
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete([order.id])}
                          className="p-1.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
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