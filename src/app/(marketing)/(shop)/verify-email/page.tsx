"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // React StrictMode'un useEffect'i 2 kez tetiklemesini engellemek için ref kullanıyoruz
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!searchParams) return;
    const token = searchParams.get("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Doğrulama token'ı bulunamadı.",
        confirmButtonColor: "#db2777",
      }).then(() => router.push("/login"));
      return;
    }

    // Eğer daha önce istek atıldıysa ikinci kez atma (Double-fetch önlemi)
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Doğru API yolu (/api/auth/verify-email) ile istek atılıyor
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
        return data;
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: data.message || "E-posta adresiniz başarıyla doğrulandı.",
          confirmButtonText: "Giriş Yap",
          confirmButtonColor: "#db2777",
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          router.push("/login");
        });
      })
      .catch((err: Error) => {
        Swal.fire({
          icon: "error",
          title: "Doğrulama Başarısız",
          text: err.message || "Geçersiz veya süresi dolmuş bağlantı.",
          confirmButtonText: "Giriş Sayfasına Dön",
          confirmButtonColor: "#db2777",
        }).then(() => {
          router.push("/login");
        });
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
          E-posta adresiniz doğrulanıyor, lütfen bekleyin...
        </p>
      </div>
    </div>
  );
}