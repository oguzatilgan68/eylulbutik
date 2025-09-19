"use client";

import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
    
export default function MyReviews() {
  const {
    data: reviews,
    error,
    isLoading,
  } = useSWR("/api/account/myreviews", fetcher);

  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata oluştu.</p>;

  if (!reviews || reviews.length === 0) {
    return <p>Henüz yorum yapmadınız.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <div
          key={review.id}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg shadow bg-white dark:bg-gray-800"
        >
          {/* Ürün görseli */}
          <Link href={`/product/${review.product.slug}`} className="shrink-0">
            <div className="relative w-24 h-24 rounded overflow-hidden">
              <Image
                src={review.product.images?.[0]?.url || "/placeholder.png"}
                alt={review.product.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* İçerik */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/product/${review.product.slug}`}
                className="font-semibold hover:underline"
              >
                {review.product.name}
              </Link>
              <span className="text-yellow-500 text-sm">
                {"⭐".repeat(review.rating)}
              </span>
            </div>

            {review.title && (
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {review.title}
              </h4>
            )}

            {review.content && (
              <p className="text-gray-700 dark:text-gray-300">
                {review.content}
              </p>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              {review.isApproved ? (
                <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
                  Onaylandı
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200">
                  Onay Bekliyor
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
