"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    // 3 saniye bekleyip ana sayfaya yönlendir
    const timeout = setTimeout(() => {
      router.replace("/"); // replace ile history’e kaydetmeden yönlendirir
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-6xl font-extrabold text-gray-800 dark:text-white mb-4">
        404
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        Üzgünüz, aradığınız sayfa bulunamadı. 3 saniye içinde ana sayfaya
        yönlendirileceksiniz.
      </p>
    </div>
  );
}
