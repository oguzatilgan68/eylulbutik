"use client";

import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";

interface Review {
  id: string;
  user: { fullName: string; initials?: string };
  rating: number;
  title: string;
  content: string;
  createdAt: string;
}

interface ReviewsProps {
  productId: string;
}

export default function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews/${productId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-400 gap-2 text-sm">
        <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
        <span>Yorumlar yükleniyor...</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
        Bu ürün için henüz değerlendirme yapılmamış.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900 shadow-sm space-y-2 transition-all hover:border-pink-500/30"
        >
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-100 dark:border-pink-900/50">
                {r.user.fullName ? r.user.fullName.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {r.user.fullName}
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < r.rating
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "stroke-gray-200 dark:stroke-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {r.title && (
            <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm pt-1">
              {r.title}
            </h5>
          )}

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {r.content}
          </p>

          <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-50 dark:border-gray-800/60 flex justify-between items-center">
            <span>Doğrulanmış Alışveriş ✓</span>
            <span>{new Date(r.createdAt).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}