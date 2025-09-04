"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/app/(marketing)/components/ui/button";

type ReviewItem = {
  id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  createdAt: string;
  user?: { fullName: string } | null;
};

export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<{
    ratingAvg: number;
    ratingCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [myRating, setMyRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/reviews/list?productId=${productId}`, {
          cache: "no-store",
        });
        const j = await r.json();
        if (!cancelled) {
          setReviews(j?.reviews ?? []);
          setStats(j?.stats ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const rounded = useMemo(
    () => Math.round((stats?.ratingAvg ?? 0) * 10) / 10,
    [stats]
  );

  async function submitReview() {
    setSubmitting(true);
    try {
      const r = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating: myRating, title, content }),
      });
      if (r.status === 401) {
        alert("Lütfen giriş yapın.");
        return;
      }
      const j = await r.json();
      if (j?.ok) {
        // Moderasyon bekleniyor
        setTitle("");
        setContent("");
        setMyRating(5);
        alert("Yorumunuz alındı, onay sonrası yayınlanacaktır.");
      } else {
        alert("Yorum gönderilemedi.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(stats?.ratingAvg ?? 0)
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "stroke-gray-400 dark:stroke-gray-500"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          {stats
            ? `${rounded}/5 (${stats.ratingCount} değerlendirme)`
            : "Değerlendirme yok"}
        </p>
      </div>

      {/* Yorum listesi */}
      <div className="mt-6 grid gap-4">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            Henüz yorum yok.
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border p-4 bg-white dark:bg-gray-900 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 stroke-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              {r.title && (
                <h4 className="mt-2 font-semibold dark:text-gray-100">
                  {r.title}
                </h4>
              )}
              {r.content && (
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {r.content}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {r.user?.fullName ?? "Anonim"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Yorum formu */}
      <div className="mt-10 rounded-2xl border p-4 bg-white dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-lg font-semibold dark:text-gray-100">Yorum Yaz</h3>
        <div className="mt-3 flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Puan:
          </label>
          <select
            value={myRating}
            onChange={(e) => setMyRating(Number(e.target.value))}
            className="rounded-lg border px-2 py-1 bg-white dark:bg-gray-950 dark:text-gray-200 dark:border-gray-700"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık (opsiyonel)"
          className="mt-3 w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-950 dark:text-gray-200 dark:border-gray-700"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Deneyimini paylaş..."
          className="mt-3 w-full rounded-lg border px-3 py-2 min-h-[100px] bg-white dark:bg-gray-950 dark:text-gray-200 dark:border-gray-700"
        />
        <div className="mt-3">
          <Button
            onClick={submitReview}
            disabled={submitting}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl"
          >
            {submitting ? "Gönderiliyor..." : "Gönder"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Yorumlar onaylandıktan sonra yayınlanır.
        </p>
      </div>
    </div>
  );
}
