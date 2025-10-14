"use client";

import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { useUser } from "@/app/(marketing)/context/userContext";
import React, { useState, useEffect } from "react";
import * as z from "zod";

// Zod schema
const accountSchema = z.object({
  fullName: z.string().min(3, "Ad Soyad en az 3 karakter olmalı"),
  email: z.email("Geçerli bir email girin"),
  phone: z.string().optional(),
});

export default function AccountPage() {
  const { user, setUser } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailIsVerified, setEmailIsVerified] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone || "");
      setEmailIsVerified(user.emailVerified ? "true" : "false");
    }
  }, [user]);
  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Bilgilerim", href: "/account/my-info" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setFormErrors({});

    // Frontend Zod validasyonu
    const parsed = accountSchema.safeParse({ fullName, email, phone });
    if (!parsed.success) {
      const fieldErrors: { [key: string]: string } = {};
      parsed.error.issues.forEach((err: any) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    // Backend çağrısı
    const res = await fetch("/api/account/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Bir hata oluştu");
      return;
    }

    setUser(data.user);
    setSuccess("Bilgileriniz başarıyla güncellendi!");
  };

  if (!user) return <p className="text-center py-10">Yükleniyor...</p>;

  return (
    <div className="max-w-3xl mx-auto p-2 md:p-10">
      <Breadcrumb items={breadcrumbs} />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
        {!emailIsVerified && (
          <div className="bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-medium">
              Email adresiniz doğrulanmamış. Lütfen email kutunuzu kontrol edin.
            </p>
            <button
              className="mt-2 text-yellow-700 dark:text-yellow-300 underline"
              onClick={async () => {
                await fetch("/api/resend-verification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: user.email }),
                });
                alert(
                  "Doğrulama emaili gönderildi. Lütfen email kutunuzu kontrol edin."
                );
              }}
            >
              <span className="underline">Doğrulama emaili gönder</span>
            </button>
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Kullanıcı Bilgilerim
        </h1>

        {success && (
          <p className="text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300 p-3 rounded mb-6">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded mb-6">
            {error}
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
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.fullName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition`}
            />
            {formErrors.fullName && (
              <p className="text-red-500 mt-1">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition`}
            />
            {formErrors.email && (
              <p className="text-red-500 mt-1">{formErrors.email}</p>
            )}
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
                  const cleaned = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setPhone(cleaned);
                }}
                placeholder="5XXXXXXXXX"
                className={`w-full px-4 py-3 rounded-r-lg border ${
                  formErrors.phone
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition`}
              />
            </div>
            {formErrors.phone && (
              <p className="text-red-500 mt-1">{formErrors.phone}</p>
            )}
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
