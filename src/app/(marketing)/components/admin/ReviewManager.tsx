"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import Pagination from "../ui/Pagination";
import { FiMessageSquare, FiSearch, FiCheck, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  });

export default function ReviewManager() {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [approvedFilter, setApprovedFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(approvedFilter ? { approved: approvedFilter } : {}),
    ...(search ? { q: search } : {}),
  });

  const url = `/api/admin/reviews?${query.toString()}`;
  const { data, error, isLoading } = useSWR(url, fetcher);

  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const reviews = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Yorum onaylama
  async function handleApprove(id: string) {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      mutate(url);
    } catch (err) {
      console.error("Onaylama hatası:", err);
    }
  }

  // Yorum silme
  async function handleDelete(id: string) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      mutate(url);
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  }

  // Yorum düzenleme kaydetme
  async function handleSave(id: string) {
    if (!editContent.trim()) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      setEditing(null);
      mutate(url);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  }

  const inputClass =
    "px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Filtreleme */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiMessageSquare className="text-pink-600" /> Ürün Yorumları ve Moderasyon
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Müşterilerin ürünlere yaptığı yorumları onaylayın veya düzenleyin.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl">
            Toplam {total} Yorum
          </span>
        </div>

        {/* Filtre Çubuğu */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Ürün veya kullanıcı adı ile ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className={`w-full pl-10 ${inputClass}`}
            />
          </div>
          <select
            value={approvedFilter || ""}
            onChange={(e) => {
              setApprovedFilter(e.target.value || null);
              setPage(1);
            }}
            className={`w-full sm:w-48 ${inputClass}`}
          >
            <option value="">Tüm Durumlar</option>
            <option value="true">Onaylı Yorumlar</option>
            <option value="false">Onaysız (Bekleyen)</option>
          </select>
        </div>
      </div>

      {/* Liste Alanı */}
      {isLoading && (
        <div className="bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
            <span>Yorumlar yükleniyor...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-sm font-medium border border-rose-200 dark:border-rose-900">
          Hata: {error.message}
        </div>
      )}

      {!isLoading && !error && reviews.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-gray-500 dark:text-gray-400 text-sm">
          Kriterlere uygun yorum bulunamadı.
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review: any) => {
          const createdAt = new Date(review.createdAt);
          const formattedDate = new Intl.DateTimeFormat("tr-TR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(createdAt);

          return (
            <div
              key={review.id}
              className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-3 transition-all hover:border-pink-500/40"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    {review.product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <strong className="text-gray-700 dark:text-gray-200">{review.user?.fullName || "Anonim"}</strong> ({review.user?.email || "E-posta yok"})
                  </p>
                  <span className="inline-block text-[11px] text-gray-400 mt-1">
                    {formattedDate}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-2.5 py-1 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
                  <span className="text-yellow-500 text-xs font-bold">{review.rating}.0</span>
                  <span className="text-yellow-400 text-xs">{"★".repeat(review.rating)}</span>
                </div>
              </div>

              <div className="pt-2">
                {editing === review.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={`w-full min-h-[100px] resize-y ${inputClass}`}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(null)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Vazgeç
                      </button>
                      <button
                        onClick={() => handleSave(review.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 shadow-sm"
                      >
                        <FiSave size={13} /> Kaydet
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-50/50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                    {review.content}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap gap-2">
                <div>
                  {review.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <FiCheck size={12} /> Onaylı Yorum
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                      Onay Bekliyor
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <FiCheck size={13} /> Onayla
                    </button>
                  )}

                  {editing !== review.id && (
                    <button
                      onClick={() => {
                        setEditing(review.id);
                        setEditContent(review.content || "");
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold transition-colors"
                    >
                      <FiEdit2 size={13} /> Düzenle
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold transition-colors"
                  >
                    <FiTrash2 size={13} /> Sil
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {!isLoading && !error && reviews.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}