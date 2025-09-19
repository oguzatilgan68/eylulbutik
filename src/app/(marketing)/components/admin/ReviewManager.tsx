"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  });

export default function ReviewManager() {
  const {
    data: reviews,
    error,
    isLoading,
  } = useSWR("/api/admin/reviews", fetcher);
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata oluştu: {error.message}</p>;

  // Eğer array değilse boş array yap
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <p>Henüz yorum yok.</p>;
  }

  async function handleApprove(id: string) {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: { isApproved: true } }),
    });
    mutate("/api/admin/reviews");
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    mutate("/api/admin/reviews");
  }

  async function handleSave(id: string) {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: { content: editContent } }),
    });
    setEditing(null);
    mutate("/api/admin/reviews");
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <div
          key={review.id}
          className="p-4 rounded-lg shadow bg-white dark:bg-gray-800"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="font-semibold">{review.product.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {review.user?.name || "Anonim"} ({review.user?.email || "?"})
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
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
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
    </div>
  );
}
