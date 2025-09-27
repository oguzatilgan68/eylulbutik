"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Doğrulama yapılıyor...");

  useEffect(() => {
    if (!searchParams) return;

    const token = searchParams.get("token");
    if (!token) {
      setMessage("Token bulunamadı!");
      return;
    }

    fetch(`/api/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
        return data;
      })
      .then((data) => {
        setMessage(data.message);
        setTimeout(() => router.push("/"), 2000); // 2 saniye sonra yönlendir
      })
      .catch((err: Error) => setMessage(err.message));
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-lg">{message}</p>
    </div>
  );
}
