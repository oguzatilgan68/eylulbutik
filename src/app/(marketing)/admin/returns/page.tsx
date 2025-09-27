"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { ReturnRequest } from "@/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function ReturnsAdminPage() {
  const [list, setList] = useState<ReturnRequest[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ReturnRequest | null>(null);

  async function fetchList() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("perPage", String(perPage));

    const res = await fetch(`/api/admin/returns?${params.toString()}`);
    const json = await res.json();
    setList(json.data);

    setTotal(json.meta.total);
    setLoading(false);
  }

  useEffect(() => {
    fetchList();
  }, [q, status, page]);

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch("/api/admin/returns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    const json = await res.json();
    setList((prev) => prev.map((r) => (r.id === id ? json.data : r)));
    if (selected?.id === id) setSelected(json.data);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-semibold">İade Talepleri</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Ara..."
              className="w-full sm:w-64 rounded-lg border px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="PENDING">Bekliyor</option>
              <option value="APPROVED">Onaylandı</option>
              <option value="REJECTED">Reddedildi</option>
              <option value="REFUNDED">İade Edildi</option>
            </select>
          </div>
        </header>

        {/* List */}
        {loading ? (
          <div className="py-10 text-center text-slate-500">Yükleniyor...</div>
        ) : list.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            Sonuç bulunamadı
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile: Cards */}
            <div className="grid gap-4 sm:hidden">
              {list.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {r.user?.fullName ||
                        r.user?.email ||
                        r.user?.phone ||
                        "Guest"}
                    </div>
                    <Badge status={r.status} />
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {r.items.length} ürün •{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm line-clamp-2 mb-3">
                    {r.reason || r.comment || "-"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={() => setSelected(r)}>
                      Detay
                    </ActionButton>
                    {r.status !== "APPROVED" && (
                      <ActionButton
                        onClick={() => updateStatus(r.id, "APPROVED")}
                      >
                        Onayla
                      </ActionButton>
                    )}
                    {r.status !== "REJECTED" && (
                      <ActionButton
                        onClick={() => updateStatus(r.id, "REJECTED")}
                      >
                        Reddet
                      </ActionButton>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden sm:block overflow-x-auto bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
              <table className="min-w-full table-auto divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="p-3 text-left">Müşteri</th>
                    <th className="p-3 text-left">Ürünler</th>
                    <th className="p-3 text-left">Sebep</th>
                    <th className="p-3 text-left">Durum</th>
                    <th className="p-3 text-left">Tarih</th>
                    <th className="p-3 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <td className="p-3">
                        <div className="font-medium">
                          {r.user?.fullName || r.user?.email || "Guest"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {r.user?.email}
                        </div>
                      </td>
                      <td className="p-3">{r.items.length} ürün</td>
                      <td className="p-3 truncate max-w-xs">
                        {r.reason || r.comment || "-"}
                      </td>
                      <td className="p-3">
                        <Badge status={r.status} />
                      </td>
                      <td className="p-3">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <ActionButton onClick={() => setSelected(r)}>
                            Detay
                          </ActionButton>
                          {r.status !== "APPROVED" && (
                            <ActionButton
                              onClick={() => updateStatus(r.id, "APPROVED")}
                            >
                              Onayla
                            </ActionButton>
                          )}
                          {r.status !== "REJECTED" && (
                            <ActionButton
                              onClick={() => updateStatus(r.id, "REJECTED")}
                            >
                              Reddet
                            </ActionButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <footer className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-slate-500">Toplam: {total}</div>
          <div className="flex gap-2 items-center">
            <ActionButton
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Önceki
            </ActionButton>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              {page}
            </span>
            <ActionButton variant="ghost" onClick={() => setPage((p) => p + 1)}>
              Sonraki
            </ActionButton>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {selected && (
        <DetailsModal
          returnRequest={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateStatus}
        />
      )}
    </div>
  );
}

/* --- Small UI Components --- */

function ActionButton({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3 py-1 rounded-md text-sm transition",
        variant === "default" &&
          "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
        variant === "ghost" &&
          "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

function Badge({ status }: { status: string }) {
  const color = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    APPROVED:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  }[status];
  return (
    <span className={clsx("px-2 py-1 rounded text-xs font-medium", color)}>
      {status}
    </span>
  );
}
function DetailsModal({
  returnRequest,
  onClose,
  onUpdate,
}: {
  returnRequest: ReturnRequest;
  onClose: () => void;
  onUpdate: (id: string, status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            İade Talebi Detayı
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-sm">
          <div>
            <div className="font-medium">Müşteri</div>
            <div className="text-slate-600 dark:text-slate-300">
              {returnRequest.user?.fullName ||
                returnRequest.user?.email ||
                "Guest"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {returnRequest.user?.email}
            </div>
          </div>
          <div>
            <div className="font-medium">İade Sebebi</div>
            <div className="text-slate-600 dark:text-slate-300">
              {returnRequest.reason || returnRequest.comment || "-"}
            </div>
          </div>
          {/* Ürünler */}
          <div>
            <div className="font-medium">Ürünler</div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              {returnRequest.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  {i.orderItem.product && (
                    <Link
                      href={`/product/${i.orderItem.product.slug}`}
                      target="_blank"
                      className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md transition"
                    >
                      <Image
                        src={
                          i.orderItem.product.images?.[0]?.url ||
                          "/placeholder.png"
                        }
                        alt={i.orderItem.product.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 object-cover rounded border dark:border-slate-700"
                      />
                      <div>
                        <div className="font-medium">
                          {i.orderItem.product.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          x {i.qty}
                        </div>
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium">Durum</div>
            <div className="text-slate-600 dark:text-slate-300">
              {returnRequest.status}
            </div>
          </div>
          <div>
            <div className="font-medium">Oluşturulma Tarihi</div>
            <div className="text-slate-600 dark:text-slate-300">
              {new Date(returnRequest.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t dark:border-slate-700">
          {returnRequest.status !== "APPROVED" && (
            <ActionButton
              onClick={() => onUpdate(returnRequest.id, "APPROVED")}
            >
              Approve
            </ActionButton>
          )}
          {returnRequest.status !== "REJECTED" && (
            <ActionButton
              onClick={() => onUpdate(returnRequest.id, "REJECTED")}
            >
              Reddet
            </ActionButton>
          )}
          <ActionButton variant="ghost" onClick={onClose}>
            Kapat
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
