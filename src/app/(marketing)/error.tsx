"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Bir hata oluştu!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Beklenmedik bir hata meydana geldi. Lütfen tekrar deneyin.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tekrar Dene
        </button>
      </body>
    </html>
  );
}
