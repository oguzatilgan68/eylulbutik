"use client";

import React, { useState } from "react";
import { FiTruck, FiX, FiCheck, FiPackage, FiHash, FiCode } from "react-icons/fi";

export type Shipment = {
  id: string;
  orderId: string;
  provider: string;
  trackingNo?: string | null;
  status: string;
  raw?: any;
  createdAt?: string;
  updatedAt?: string;
};

export const PROVIDERS = [
  "YURTICI",
  "MNG",
  "ARAS",
  "UPS",
  "PTT",
  "SURAT",
  "TRENDYOL_EXPRESS",
  "HEPSIJET",
];

export const STATUSES: { value: string; label: string; color: string }[] = [
  { value: "PENDING", label: "Beklemede", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900" },
  { value: "PROCESSING", label: "Hazırlanıyor", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900" },
  { value: "SHIPPED", label: "Kargoya Verildi", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900" },
  { value: "IN_TRANSIT", label: "Yolda", color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900" },
  { value: "DELIVERED", label: "Teslim Edildi", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900" },
  { value: "RETURNED", label: "İade Edildi", color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900" },
  { value: "CANCELED", label: "İptal Edildi", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700" },
];

export function ShipmentModal({
  initial,
  onClose,
}: {
  initial: any;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    orderId: initial?.orderId || "",
    provider: initial?.provider || PROVIDERS[0],
    trackingNo: initial?.trackingNo || "",
    status: initial?.status || "PENDING",
    raw: initial?.raw ? JSON.stringify(initial.raw, null, 2) : "",
    id: initial?.id || null,
  });
  const [saving, setSaving] = useState(false);

  async function save(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        orderId: form.orderId,
        provider: form.provider,
        trackingNo: form.trackingNo || null,
        status: form.status,
      };
      if (form.raw) {
        try {
          payload.raw = JSON.parse(form.raw);
        } catch {
          alert("Raw JSON formatı geçersiz.");
          setSaving(false);
          return;
        }
      }

      const method = form.id ? "PATCH" : "POST";
      const body = form.id ? { id: form.id, ...payload } : payload;

      const res = await fetch("/api/admin/shipments", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Kaydetme sırasında bir hata oluştu.");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
              <FiTruck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {form.id ? "Gönderi Bilgisini Düzenle" : "Yeni Kargo Gönderisi Oluştur"}
              </h3>
              <p className="text-xs text-gray-500">Kargo firması ve takip numarasını yönetin.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Sipariş ID
            </label>
            <input
              required
              readOnly={Boolean(form.id)}
              placeholder="Sipariş ID"
              value={form.orderId}
              onChange={(e) => setForm((s) => ({ ...s, orderId: e.target.value }))}
              className={`${inputClass} font-mono text-xs ${form.id ? "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800" : ""}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Kargo Firması *
              </label>
              <select
                value={form.provider}
                onChange={(e) => setForm((s) => ({ ...s, provider: e.target.value }))}
                className={inputClass}
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Gönderi Durumu *
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Kargo Takip Numarası
            </label>
            <input
              placeholder="Örn: 1234567890"
              value={form.trackingNo}
              onChange={(e) => setForm((s) => ({ ...s, trackingNo: e.target.value }))}
              className={`${inputClass} font-mono`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Raw JSON (Opsiyonel)
            </label>
            <textarea
              placeholder="API yanıtları için ham JSON verisi..."
              value={form.raw}
              onChange={(e) => setForm((s) => ({ ...s, raw: e.target.value }))}
              className={`${inputClass} min-h-22.5 font-mono text-xs resize-y`}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-xs shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <FiCheck size={15} />
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}