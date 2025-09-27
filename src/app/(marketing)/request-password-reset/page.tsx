"use client";

import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Bir hata oluştu");
      } else {
        setMessage("Şifre sıfırlama linki e-posta adresinize gönderildi!");
        setEmail("");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamıyor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Şifre Sıfırlama Talebi
        </h1>

        {message && (
          <p className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-900 dark:text-gray-100"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
