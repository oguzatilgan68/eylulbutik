"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";

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

  const { data, error, isLoading } = useSWR(
    `/api/admin/reviews?${query.toString()}`,
    fetcher
  );

  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const reviews = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  async function handleApprove(id: string) {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: { isApproved: true } }),
    });
    mutate(`/api/admin/reviews?${query.toString()}`);
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    mutate(`/api/admin/reviews?${query.toString()}`);
  }

  async function handleSave(id: string) {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: { content: editContent } }),
    });
    setEditing(null);
    mutate(`/api/admin/reviews?${query.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Filtreleme her zaman görünür */}
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          type="text"
          placeholder="Ara (ürün / kullanıcı)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded dark:bg-gray-700 dark:text-white"
        />
        <select
          value={approvedFilter || ""}
          onChange={(e) => {
            setApprovedFilter(e.target.value || null);
            setPage(1);
          }}
          className="border p-2 rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tümü</option>
          <option value="true">Onaylı</option>
          <option value="false">Onaysız</option>
        </select>
      </div>

      {/* Liste alanı */}
      {isLoading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-500">Hata oluştu: {error.message}</p>}
      {!isLoading && !error && reviews.length === 0 && <p>Henüz yorum yok.</p>}

      {reviews.map((review: any) => (
        <div
          key={review.id}
          className="p-4 rounded-lg shadow bg-white dark:bg-gray-800"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="font-semibold">{review.product.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {review.user?.fullName || "Anonim"} ({review.user?.email || "?"}
                )
              </p>
            </div>
            <span className="text-yellow-500">
              {"⭐".repeat(review.rating)}
            </span>
          </div>

          <div className="mt-2">
            {editing === review.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {review.content}
              </p>
            )}
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
            {review.isApproved ? (
              <span className="p-2 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
                Onaylı
              </span>
            ) : (
              <button
                onClick={() => handleApprove(review.id)}
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Onayla
              </button>
            )}

            {editing === review.id ? (
              <button
                onClick={() => handleSave(review.id)}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Kaydet
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditing(review.id);
                  setEditContent(review.content || "");
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Düzenle
              </button>
            )}

            <button
              onClick={() => handleDelete(review.id)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Sil
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {!isLoading && !error && reviews.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Toplam {total} yorum
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Önceki
            </button>
            <span>
              Sayfa {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
