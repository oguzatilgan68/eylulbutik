import React from "react";
import {
  PROVIDERS,
  STATUSES,
} from "@/app/(marketing)/components/shipment/shipmentModal";

export function Header({
  q,
  setQ,
  filterProvider,
  setFilterProvider,
  filterStatus,
  setFilterStatus,
  openCreate,
}: any) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <h2 className="text-lg font-semibold">Kargo Yönetimi</h2>
      <div className="flex gap-2 items-center flex-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Sipariş no veya takip no ara..."
          className="px-3 py-2 rounded-md border bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filterProvider}
          onChange={(e) => setFilterProvider(e.target.value)}
          className="px-3 py-2 rounded-md border bg-slate-50 dark:bg-slate-800 text-sm"
        >
          <option value="">Tüm Firmalar</option>
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-md border bg-slate-50 dark:bg-slate-800 text-sm"
        >
          <option value="">Tüm Durumlar</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={openCreate}
          className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
        >
          Yeni Gönderi
        </button>
      </div>
    </header>
  );
}
