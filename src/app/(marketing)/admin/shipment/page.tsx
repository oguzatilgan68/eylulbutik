"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  PROVIDERS,
  Shipment,
  ShipmentModal,
  STATUSES,
} from "../../components/shipment/shipmentModal";

/* ---------------- Types ---------------- */

/* ---------------- Statics ---------------- */

/* ---------------- Main Component ---------------- */
export default function ShipmentsAdmin() {
  const [list, setList] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Fetch List ---------------- */
  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (filterProvider) params.set("provider", filterProvider);
      if (filterStatus) params.set("status", filterStatus);
      params.set("page", String(page));
      params.set("perPage", String(perPage));

      const res = await fetch(`/api/admin/shipments?${params.toString()}`);
      if (!res.ok) throw new Error("Liste yüklenemedi");
      const json = await res.json();
      setList(Array.isArray(json.data) ? json.data : []);
      setTotal(json.meta?.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Hata");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, filterProvider, filterStatus, page]);

  /* ---------------- CRUD ---------------- */
  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(item: Shipment) {
    setEditing(item);
    setModalOpen(true);
  }
  async function handleDelete(id: string) {
    if (!confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/shipments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme başarısız");
      fetchList();
    } catch (err: any) {
      alert(err.message || "Hata");
    }
  }

  /* ---------------- Render ---------------- */
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-lg">
      <Header
        q={q}
        setQ={setQ}
        filterProvider={filterProvider}
        setFilterProvider={setFilterProvider}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        openCreate={openCreate}
      />

      <Table
        list={list}
        loading={loading}
        page={page}
        perPage={perPage}
        openEdit={openEdit}
        handleDelete={handleDelete}
      />

      <Pagination
        page={page}
        setPage={setPage}
        total={total}
        perPage={perPage}
      />

      {modalOpen && (
        <ShipmentModal
          initial={editing}
          onClose={() => {
            setModalOpen(false);
            fetchList();
          }}
        />
      )}

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header({
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
          onChange={(e) => {
            setQ(e.target.value);
          }}
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

/* ---------------- Table ---------------- */
function Table({ list, loading, page, perPage, openEdit, handleDelete }: any) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-100 dark:border-slate-700">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Sipariş</th>
            <th className="p-3 text-left">Kargo Firması</th>
            <th className="p-3 text-left">Takip No</th>
            <th className="p-3 text-left">Durum</th>
            <th className="p-3 text-left">Raw</th>
            <th className="p-3 text-left">Eylemler</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="p-6 text-center">
                Yükleniyor...
              </td>
            </tr>
          ) : list.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center">
                Kayıt yok
              </td>
            </tr>
          ) : (
            list.map((s: Shipment, i: number) => (
              <tr
                key={s.id}
                className={clsx(
                  "hover:bg-slate-100 dark:hover:bg-slate-700 transition",
                  i % 2 === 0
                    ? "bg-white dark:bg-slate-900"
                    : "bg-slate-50 dark:bg-slate-800"
                )}
              >
                <td className="p-3 align-top">
                  {(page - 1) * perPage + i + 1}
                </td>
                <td className="p-3 align-top font-mono">{s.orderId}</td>
                <td className="p-3 align-top">
                  <Badge text={s.provider} />
                </td>
                <td className="p-3 align-top">{s.trackingNo || "-"}</td>
                <td className="p-3 align-top">
                  <StatusBadge status={s.status} />
                </td>
                <td
                  className="p-3 align-top max-w-xs truncate"
                  title={JSON.stringify(s.raw || "")}
                >
                  {s.raw
                    ? JSON.stringify(s.raw).slice(0, 80) +
                      (JSON.stringify(s.raw).length > 80 ? "..." : "")
                    : "-"}
                </td>
                <td className="p-3 align-top">
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={() => openEdit(s)}>
                      Düzenle
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleDelete(s.id)}
                    >
                      Sil
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Pagination ---------------- */
function Pagination({ page, setPage, total, perPage }: any) {
  return (
    <footer className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-slate-500">Toplam: {total}</div>
      <Pagination page={page} totalPages={10} onPageChange={setPage} />
    </footer>
  );
}

/* ---------------- Common Components ---------------- */
function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100">
      {text}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find((x) => x.value === status);
  return (
    <span
      className={clsx(
        "inline-block px-2 py-0.5 rounded text-xs font-medium",
        s?.color
      )}
    >
      {s?.label || status}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3 py-1 rounded text-sm transition",
        variant === "default"
          ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
          : "bg-rose-600 text-white hover:bg-rose-700"
      )}
    >
      {children}
    </button>
  );
}
