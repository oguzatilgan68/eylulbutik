"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FiShoppingBag, 
  FiBox, 
  FiGrid, 
  FiDollarSign, 
  FiClock, 
  FiArrowRight, 
  FiTrendingUp, 
  FiShield,
  FiAlertCircle
} from "react-icons/fi";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingBankTransfers: number;
  totalCategories: number;
  totalRevenue: number;
}

interface Order {
  id: string;
  orderNo: string;
  total: number | string;
  status: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  } | null;
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
        }
      } catch (err) {
        console.error("Dashboard verileri çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 text-xs font-semibold">Ödendi</span>;
      case "PENDING":
        return <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 text-xs font-semibold">Beklemede</span>;
      case "FULFILLED":
        return <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 text-xs font-semibold">Kargolandı</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 text-xs font-semibold">İptal Edildi</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Üst Karşılama Alanı */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400 block mb-1">
            Yönetim Paneli
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Eylül Butik Kontrol Merkezi ✨
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Mağazanızın anlık performansını takip edin ve işlemleri yönetin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/bank-transfers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all"
          >
            <FiClock size={15} /> Havale Bildirimleri 
            {stats && stats.pendingBankTransfers > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-pink-600 text-[10px] flex items-center justify-center font-bold">
                {stats.pendingBankTransfers}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Toplam Ciro */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <FiDollarSign size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                Net Ciro
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Toplam Kazanç</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                ₺{stats?.totalRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          {/* Toplam Sipariş */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <FiShoppingBag size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                Siparişler
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Toplam Sipariş</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                {stats?.totalOrders}
              </h3>
            </div>
          </div>

          {/* Toplam Ürün */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <FiBox size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg">
                Katalog
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Aktif Ürünler</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                {stats?.totalProducts}
              </h3>
            </div>
          </div>

          {/* Bekleyen Havale */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <FiClock size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                İşlem Bekleyen
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Havale Bildirimleri</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                {stats?.pendingBankTransfers}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Hızlı Erişim Kısayolları */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Hızlı Yönetim Menüsü
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-pink-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 group-hover:scale-110 transition-transform">
                <FiBox size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Ürün Yönetimi</p>
                <p className="text-xs text-gray-500">Ürün ekle, düzenle, stok güncelle</p>
              </div>
            </div>
            <FiArrowRight className="text-gray-400 group-hover:text-pink-600 transition-colors" />
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-pink-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 group-hover:scale-110 transition-transform">
                <FiShoppingBag size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Sipariş Yönetimi</p>
                <p className="text-xs text-gray-500">Müşteri siparişlerini incele</p>
              </div>
            </div>
            <FiArrowRight className="text-gray-400 group-hover:text-pink-600 transition-colors" />
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-pink-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 group-hover:scale-110 transition-transform">
                <FiGrid size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Kategoriler</p>
                <p className="text-xs text-gray-500">Koleksiyon ve kategori ağacı</p>
              </div>
            </div>
            <FiArrowRight className="text-gray-400 group-hover:text-pink-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Son Gelen Siparişler Tablosu */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <FiTrendingUp className="text-pink-600" /> Son Gelen Siparişler
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">Henüz hiç sipariş bulunmuyor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/50 text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  <th className="py-3.5 px-6 font-semibold">Sipariş No</th>
                  <th className="py-3.5 px-6 font-semibold">Müşteri</th>
                  <th className="py-3.5 px-6 font-semibold">Tutar</th>
                  <th className="py-3.5 px-6 font-semibold">Durum</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.map((order) => {
                  const date = new Date(order.createdAt).toLocaleDateString("tr-TR");
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">#{order.orderNo}</td>
                      <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                        {order.user?.fullName || "Misafir Müşteri"}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-gray-900 dark:text-white">
                        ₺{Number(order.total).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">{getOrderStatusBadge(order.status)}</td>
                      <td className="py-4 px-6 text-right text-gray-400">{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}