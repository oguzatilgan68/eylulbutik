"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [validToken, setValidToken] = useState(false);

  // Token kontrolü
  useEffect(() => {
    if (!token) return;
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (res.ok && data.valid) setValidToken(true);
        else setError("Token geçersiz veya süresi dolmuş.");
      } catch {
        setError("Token doğrulanamadı.");
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu");
      } else {
        setMessage(
          "Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz..."
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch {
      setError("Sunucuya bağlanılamıyor");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <p className="p-4 text-red-600">Geçersiz link</p>;
  if (error && !validToken) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Yeni Şifre Belirle
        </h1>

        {message && (
          <p className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {message}
          </p>
        )}
        {error && validToken && (
          <p className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</p>
        )}

        {validToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700 dark:text-gray-200">
                Yeni Şifre
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900 dark:text-gray-100"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-200">
                Şifreyi Onayla
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900 dark:text-gray-100"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
