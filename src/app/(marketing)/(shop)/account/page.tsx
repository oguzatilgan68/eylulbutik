"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "../../context/userContext";

export default function AccountPage() {
  const { user, setUser } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    const res = await fetch("/api/account/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone }),
    });

    if (!res.ok) return;

    const data = await res.json();
    setUser(data.user);
    setSuccess("Bilgileriniz başarıyla güncellendi!");
  };

  if (!user) return <p className="text-center py-10">Yükleniyor...</p>;

  return (
    <div className="max-w-3xl mx-auto p-2 md:p-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Kullanıcı Bilgilerim
        </h1>

        {success && (
          <p className="text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300 p-3 rounded mb-6">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Ad Soyad
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Telefon
            </label>
            <div className="flex items-center">
              <span className="inline-block px-3 py-3 rounded-l-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-r-0 border-gray-300 dark:border-gray-600">
                +90
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  // Sadece rakam al ve 10 hane ile sınırla
                  const cleaned = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setPhone(cleaned);
                }}
                placeholder="5XXXXXXXXX"
                className="w-full px-4 py-3 rounded-r-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
          >
            Güncelle
          </button>
        </form>
      </div>
    </div>
  );
}
