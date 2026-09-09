"use client";

import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { useUser } from "@/app/(marketing)/context/userContext";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiSend,
  FiSave,
  FiShield,
} from "react-icons/fi";

const accountSchema = z.object({
  fullName: z.string().min(3, "Ad Soyad en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().optional(),
});

export default function AccountPage() {
  const { user, setUser } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setIsVerified(Boolean(user.emailVerified));
    }
  }, [user]);

  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Kişisel Bilgilerim", href: "/account/my-info" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setFormErrors({});

    const parsed = accountSchema.safeParse({ fullName, email, phone });
    if (!parsed.success) {
      const fieldErrors: { [key: string]: string } = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Güncelleme sırasında bir hata oluştu");
        return;
      }

      setUser(data.user);
      setSuccess("Bilgileriniz başarıyla güncellendi.");
    } catch {
      setError("Bağlantı hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      alert("Doğrulama bağlantısı e-posta adresinize iletildi.");
    } catch {
      alert("E-posta gönderilemedi, lütfen tekrar deneyin.");
    } finally {
      setResending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
          Yükleniyor...
        </span>
      </div>
    );
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "U";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      <Breadcrumb items={breadcrumbs} />

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none transition-all">
        
        {/* Üst Profil Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-gray-100 dark:border-gray-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-pink-500/20">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Hesap Bilgileri
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Kişisel verilerinizi ve iletişim tercihlerinizi yönetin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                <FiShield size={14} /> Doğrulanmış Hesap
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                <FiAlertCircle size={14} /> Doğrulanmamış
              </span>
            )}
          </div>
        </div>

        {/* E-posta Doğrulama Bildirimi */}
        {!isVerified && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 gap-3">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-amber-500 mt-0.5 shrink-0" size={18} />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                E-posta adresiniz henüz onaylanmamış. Güvenliğiniz için lütfen gelen kutunuzu kontrol edin.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-200/50 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/70 px-3.5 py-2 rounded-xl transition cursor-pointer self-end sm:self-auto disabled:opacity-50"
            >
              <FiSend size={12} />
              {resending ? "Gönderiliyor..." : "Bağlantıyı Yeniden Gönder"}
            </button>
          </div>
        )}

        {/* Başarı & Hata Rozetleri */}
        {success && (
          <div className="mt-6 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 text-xs font-medium">
            <FiCheckCircle size={16} />
            {success}
          </div>
        )}
        {error && (
          <div className="mt-6 flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 text-xs font-medium">
            <FiAlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form Alanı */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ad Soyad */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Ad Soyad
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adınız ve Soyadınız"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50/50 dark:bg-gray-800/50 border transition outline-none ${
                    formErrors.fullName
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } dark:text-white`}
                />
              </div>
              {formErrors.fullName && (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.fullName}</p>
              )}
            </div>

            {/* E-posta */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                E-posta Adresi
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@alanadi.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50/50 dark:bg-gray-800/50 border transition outline-none ${
                    formErrors.email
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  } dark:text-white`}
                />
              </div>
              {formErrors.email && (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.email}</p>
              )}
            </div>

            {/* Telefon */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Telefon Numarası
              </label>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 transition">
                <span className="inline-flex items-center gap-1.5 px-3.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-xs font-semibold border-r border-gray-200 dark:border-gray-700 select-none">
                  <FiPhone size={14} className="text-gray-400" /> +90
                </span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(cleaned);
                  }}
                  placeholder="5XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-800/50 outline-none dark:text-white"
                />
              </div>
              {formErrors.phone && (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Aksiyon Alanı */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSave size={15} />
              )}
              Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}