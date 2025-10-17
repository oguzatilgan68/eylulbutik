"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
}) {
  const router = useRouter();
  const [popupShown, setPopupShown] = useState(false);

  useEffect(() => {
    if (!error || popupShown) return;
    setPopupShown(true);

    console.error("💥 Global error:", error);

    if (error?.status === 429) {
      Swal.fire({
        icon: "warning",
        title: "Çok fazla istek 😅",
        text:
          error.message ||
          "Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.",
        confirmButtonText: "Tamam",
      }).then(() => reset());
    } else {
      Swal.fire({
        icon: "error",
        title: "Bir hata oluştu 😕",
        text: error.message || "Beklenmedik bir hata meydana geldi.",
        confirmButtonText: "Tamam",
      }).then(() => reset());
    }
  }, [error, reset, popupShown]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Eylül Butik
            </span>
          </div>
        </div>
      </header>

      {/* Hata İçeriği */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 dark:bg-red-800 p-4 rounded-full">
            <AlertTriangle className="text-red-600 dark:text-red-300 w-12 h-12" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Bir hata oluştu 😕
        </h2>

        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          Üzgünüz, beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin
          veya ana sayfaya dönün.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <Button
            variant="default"
            onClick={() => reset()}
            className="rounded-xl"
          >
            Yeniden Dene
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/")}
            className="rounded-xl"
          >
            Ana Sayfaya Dön
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <pre className="mt-6 text-left text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-red-600 dark:text-red-400">
            {error?.message}
          </pre>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Eylül Butik. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
