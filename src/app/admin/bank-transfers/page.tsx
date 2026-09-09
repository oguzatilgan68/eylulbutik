"use client";

import React, { useEffect, useState } from "react";
import { 
  FiDollarSign, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiSearch, 
  FiShoppingBag, 
  FiFileText,
  FiAlertCircle
} from "react-icons/fi";

interface TransferItem {
  id: string;
  senderName: string;
  bankName: string | null;
  amount: number | string;
  note: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: string;
  order: {
    orderNo: string;
    total: number | string;
    status: string;
    createdAt: string;
  };
  user: {
    fullName: string;
    email: string;
    phone: string | null;
  };
}

export default function AdminBankTransfersPage() {
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Bildirimleri çek
  const fetchTransfers = async (status = filterStatus) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/bank-transfers?status=${status}`);
      const data = await res.json();
      if (res.ok) {
        setTransfers(data.transfers || []);
      }
    } catch (err) {
      console.error("Havale bildirimleri yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers(filterStatus);
  }, [filterStatus]);

  // Onayla veya Reddet işlemi
  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    const actionText = action === "APPROVE" ? "onaylamak" : "reddetmek";
    if (!confirm(`Bu havale bildirimini ${actionText} istediğinize emin misiniz?`)) return;

    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/bank-transfers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchTransfers(filterStatus);
      } else {
        alert("İşlem başarısız: " + (data.error || "Bilinmeyen hata"));
      }
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası oluştu.");
    } finally {
      setProcessingId(null);
    }
  };

  // Arama filtrelemesi
  const filteredTransfers = transfers.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.senderName.toLowerCase().includes(query) ||
      t.order.orderNo.toLowerCase().includes(query) ||
      t.user.email.toLowerCase().includes(query) ||
      (t.bankName && t.bankName.toLowerCase().includes(query))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[11px] font-semibold shrink-0">
            <FiClock size={12} /> Bekliyor
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold shrink-0">
            <FiCheck size={12} /> Onaylandı
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-semibold shrink-0">
            <FiX size={12} /> Reddedildi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Üst Başlık */}
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 shrink-0">
              <FiDollarSign size={22} />
            </div>
            <span className="wrap-break-word">Banka Havale / EFT Bildirimleri</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Müşterilerin yaptığı havale ödemelerini buradan kontrol edin, onaylayın veya reddedin.
          </p>
        </div>

        {/* Durum Sekmeleri (Filtreler) - Mobilde yatay kaydırılabilir yapıldı */}
        <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/60 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 min-w-max">
            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => {
              const labels: Record<string, string> = {
                PENDING: "Bekleyenler",
                APPROVED: "Onaylananlar",
                REJECTED: "Reddedilenler",
                ALL: "Tümü",
              };
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterStatus === status
                      ? "bg-white dark:bg-gray-900 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arama Çubuğu */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Gönderen adı, sipariş no, e-posta veya banka ile ara..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm transition-all"
        />
      </div>

      {/* İçerik / Liste */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-3 border-pink-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredTransfers.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2 p-4">
          <div className="w-14 h-14 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-2">
            <FiAlertCircle size={26} />
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">Bildirim Bulunamadı</h3>
          <p className="text-xs text-gray-500">Bu kategoride henüz herhangi bir havale bildirimi yer almıyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransfers.map((item) => {
            const date = new Date(item.createdAt).toLocaleString("tr-TR");
            const isProcessing = processingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between transition-all hover:border-pink-500/30 overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Üst Kısım: Sipariş No & Durum */}
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 gap-2">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-1.5 truncate">
                      <FiShoppingBag className="text-pink-600 shrink-0" /> 
                      <span className="truncate">Sipariş #{item.order.orderNo}</span>
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Müşteri ve Gönderen Detayları (Mobilde alt alta, büyük ekranda yan yana) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1 bg-gray-50/50 dark:bg-gray-800/30 p-2.5 rounded-2xl">
                      <span className="text-gray-400 font-semibold uppercase tracking-wider block text-[10px]">Müşteri</span>
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{item.user.fullName}</p>
                      <p className="text-gray-500 truncate">{item.user.email}</p>
                    </div>
                    <div className="space-y-1 bg-gray-50/50 dark:bg-gray-800/30 p-2.5 rounded-2xl">
                      <span className="text-gray-400 font-semibold uppercase tracking-wider block text-[10px]">Havale Yapan</span>
                      <p className="font-bold text-gray-900 dark:text-white truncate">{item.senderName}</p>
                      <p className="text-pink-600 dark:text-pink-400 font-medium truncate">{item.bankName || "Belirtilmedi"}</p>
                    </div>
                  </div>

                  {/* Tutar ve Tarih Bilgisi */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-gray-400 block">Bildirilen Tutar</span>
                      <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                        ₺{Number(item.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-gray-400 block">İşlem Tarihi</span>
                      <span className="text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">{date}</span>
                    </div>
                  </div>

                  {/* Müşteri Notu varsa */}
                  {item.note && (
                    <div className="text-xs bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-gray-600 dark:text-gray-300 flex items-start gap-2 break-all">
                      <FiFileText className="text-gray-400 mt-0.5 shrink-0" size={14} />
                      <p><strong>Müşteri Notu:</strong> {item.note}</p>
                    </div>
                  )}
                </div>

                {/* Aksiyon Butonları (Yalnızca Bekleyenler İçin Aktif) - Mobilde alt alta veya esnek */}
                {item.status === "PENDING" && (
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleAction(item.id, "APPROVE")}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 text-center"
                    >
                      <FiCheck size={15} className="shrink-0" /> 
                      <span>{isProcessing ? "İşleniyor..." : "Onayla (Ödendi Yap)"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleAction(item.id, "REJECT")}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 text-center"
                    >
                      <FiX size={15} className="shrink-0" /> 
                      <span>{isProcessing ? "İşleniyor..." : "Reddet"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}