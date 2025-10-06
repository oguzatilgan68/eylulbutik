"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("OrdersPage hata:", error);
  }, [error]);

  return (
    <div className="p-8 text-center space-y-4">
      <h2 className="text-xl font-semibold text-red-600">
        Siparişler yüklenirken bir hata oluştu.
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Lütfen tekrar deneyin veya daha sonra tekrar kontrol edin.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
