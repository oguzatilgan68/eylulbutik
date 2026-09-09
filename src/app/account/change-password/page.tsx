"use client";

import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { useState } from "react";
import { FiLock, FiCheck, FiKey, FiAlertCircle } from "react-icons/fi";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "kullanicinin-id-si", // session veya JWT'den alınabilir
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Bir hata oluştu");
      } else {
        setMessage(data.message || "Şifreniz başarıyla güncellendi! ✨");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setError("Sunucu bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Şifremi Değiştir" },
  ];

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <Breadcrumb items={breadcrumbs} />

      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiKey className="text-pink-600" /> Hesap Şifrenizi Değiştirin
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Güvenliğiniz için şifrenizi düzenli olarak güncellemeyi unutmayın.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Eski Şifre *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Yeni Şifre *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Yeni Şifre (Tekrar) *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {message && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-semibold border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
              <FiCheck size={16} /> {message}
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold border border-rose-200 dark:border-rose-900 flex items-center gap-2">
              <FiAlertCircle size={16} /> {error}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <FiLock size={16} />
              {loading ? "Güncelleniyor..." : "Şifreyi Değiştir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}