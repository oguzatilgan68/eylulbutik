"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  user: { fullName: string };
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

  if (loading) return <p>Yorumlar yükleniyor...</p>;
  if (reviews.length === 0) return <p>Henüz yorum yok.</p>;

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="border rounded-lg p-4 dark:border-gray-700 flex flex-col gap-1"
        >
          <div className="flex justify-between items-center flex-wrap">
            <span className="font-semibold">{r.user.fullName}</span>
            <span className="text-yellow-500">{r.rating} ⭐</span>
          </div>
          {r.title && <h5 className="font-medium">{r.title}</h5>}
          <p className="text-gray-700 dark:text-gray-300">{r.content}</p>
          <small className="text-gray-400">
            {new Date(r.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}
