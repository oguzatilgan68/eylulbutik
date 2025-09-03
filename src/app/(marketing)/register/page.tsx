"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, phone }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.error || "Kayıt sırasında hata oluştu");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Kayıt Ol
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Ad Soyad"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Telefon (opsiyonel)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-6 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none"
        />

        <button className="w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-600 transition">
          Kayıt Ol
        </button>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
          Hesabınız var mı?{" "}
          <Link href="/login" className="text-pink-500 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </form>
    </div>
  );
}
