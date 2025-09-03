"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";
import Link from "next/link";
import { tr } from "zod/v4/locales";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      // Kullanıcıyı context’e yükle
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);
      router.push("/"); // anasayfaya yönlendir
    } catch (err) {
      setError("Giriş başarısız, lütfen bilgilerinizi kontrol edin.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Giriş Yap
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-3">
          <span className="text-gray-700 dark:text-gray-200">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-pink-500 focus:border-pink-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 dark:text-gray-200">Şifre</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-pink-500 focus:border-pink-500"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors"
        >
          Giriş Yap
        </button>

        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-pink-500 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </form>
    </div>
  );
}
