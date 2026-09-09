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
  const [hoverRating, setHoverRating] = useState(0);
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
    if (!content.trim()) {
      alert("Lütfen deneyiminizi birkaç kelime ile paylaşın.");
      return;
    }

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

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-8">
      {/* Üst Özet Bilgi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Müşteri Değerlendirmeleri
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Bu ürünü satın alan müşterilerimizin gerçek deneyimleri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(stats?.ratingAvg ?? 0)
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-gray-300 dark:stroke-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {stats ? rounded : "0.0"}
            </span>
            <span className="text-xs text-gray-400 block">
              {stats ? `(${stats.ratingCount} değerlendirme)` : "Henüz değerlendirme yok"}
            </span>
          </div>
        </div>
      </div>

      {/* Yorum Listesi */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
            <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
            <span>Yorumlar yükleniyor...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
            Bu ürün için henüz yorum yapılmamış. İlk yorumu sen yaz! ✨
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-gray-200 dark:stroke-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>

              {r.title && (
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                  {r.title}
                </h4>
              )}

              {r.content && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {r.content}
                </p>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 dark:border-gray-800/60 mt-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {r.user?.fullName ?? "Anonim Müşteri"}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  Doğrulanmış Alışveriş ✓
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Yorum Yazma Formu */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 bg-white dark:bg-gray-900 shadow-sm space-y-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Ürünü Değerlendir
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Deneyimlerinizi diğer müşterilerimizle paylaşın.
          </p>
        </div>

        {/* İnteraktif Yıldız Puanlama */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Puanınız:
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const ratingValue = i + 1;
              return (
                <Star
                  key={i}
                  className={`h-6 w-6 cursor-pointer transition-transform hover:scale-110 ${
                    ratingValue <= (hoverRating || myRating)
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "stroke-gray-300 dark:stroke-gray-700"
                  }`}
                  onMouseEnter={() => setHoverRating(ratingValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setMyRating(ratingValue)}
                />
              );
            })}
          </div>
        </div>

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yorum Başlığı (Örn: Harika bir ürün, tam beklediğim gibi)"
            className={inputClass}
          />
        </div>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ürün hakkındaki detaylı deneyiminizi buraya yazabilirsiniz..."
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-gray-400">
            * Yorumlar moderasyon onayından sonra yayınlanır.
          </p>
          <Button
            onClick={submitReview}
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
          </Button>
        </div>
      </div>
    </div>
  );
}