"use client";

import React from "react";
import { useState } from "react";

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
  { value: "PENDING", label: "Beklemede", color: "bg-yellow-500 text-white" },
  {
    value: "PROCESSING",
    label: "Hazırlanıyor",
    color: "bg-indigo-500 text-white",
  },
  {
    value: "SHIPPED",
    label: "Kargoya Verildi",
    color: "bg-indigo-600 text-white",
  },
  { value: "IN_TRANSIT", label: "Yolda", color: "bg-indigo-400 text-white" },
  {
    value: "DELIVERED",
    label: "Teslim Edildi",
    color: "bg-emerald-600 text-white",
  },
  { value: "RETURNED", label: "İade Edildi", color: "bg-rose-600 text-white" },
  { value: "CANCELED", label: "İptal Edildi", color: "bg-gray-500 text-white" },
];
export function ShipmentModal({
  initial,
  onClose,
}: {
  initial: Shipment | null;
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
          alert("Raw JSON geçersiz");
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
      if (!res.ok) throw new Error("Kaydetme hatası");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Hata");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {form.id ? "Gönderi Düzenle" : "Yeni Gönderi"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Kapat
          </button>
        </div>

        {/* Form */}
        <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            placeholder="Sipariş ID"
            value={form.orderId}
            onChange={(e) =>
              setForm((s) => ({ ...s, orderId: e.target.value }))
            }
            className="p-2 border rounded bg-slate-50 dark:bg-slate-800"
          />

          <select
            value={form.provider}
            onChange={(e) =>
              setForm((s) => ({ ...s, provider: e.target.value }))
            }
            className="p-2 border rounded bg-slate-50 dark:bg-slate-800"
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <input
            placeholder="Takip No"
            value={form.trackingNo}
            onChange={(e) =>
              setForm((s) => ({ ...s, trackingNo: e.target.value }))
            }
            className="p-2 border rounded bg-slate-50 dark:bg-slate-800"
          />

          <select
            value={form.status}
            onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
            className="p-2 border rounded bg-slate-50 dark:bg-slate-800"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Raw JSON (opsiyonel)"
            value={form.raw}
            onChange={(e) => setForm((s) => ({ ...s, raw: e.target.value }))}
            className="sm:col-span-2 p-2 border rounded bg-slate-50 dark:bg-slate-800 min-h-[120px] font-mono text-xs"
          />

          {/* Buttons */}
          <div className="sm:col-span-2 flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded border"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
