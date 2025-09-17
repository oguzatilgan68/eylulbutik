"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

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
    // optimistic refresh
    setList((prev) => prev.map((r) => (r.id === id ? json.data : r)));
    if (selected?.id === id) setSelected(json.data);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
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
              placeholder="Ürün adı, müşteri, sebep..."
              className="w-full sm:w-64 rounded-xl border px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="PENDING">Bekliyor</option>
              <option value="APPROVED">Onaylandı</option>
              <option value="REJECTED">Reddedildi</option>
              <option value="REFUNDED">İade Edildi</option>
            </select>
          </div>
        </header>

        {/* Table */}
        <div className="overflow-x-auto bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
          <table className="min-w-full table-auto divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-700 text-sm">
              <tr>
                <TableHeadCell>#</TableHeadCell>
                <TableHeadCell>Müşteri</TableHeadCell>
                <TableHeadCell>Ürünler</TableHeadCell>
                <TableHeadCell>İade Sebebi</TableHeadCell>
                <TableHeadCell>Durum</TableHeadCell>
                <TableHeadCell>Tarih</TableHeadCell>
                <TableHeadCell>İşlemler</TableHeadCell>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <TableCell colSpan={7} center>
                    Yükleniyor...
                  </TableCell>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <TableCell colSpan={7} center>
                    Sonuç Bulunamadı
                  </TableCell>
                </tr>
              ) : (
                list.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <TableCell>{(page - 1) * perPage + idx + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {r.user?.fullName || r.user?.email || "Guest"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {r.user?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{r.items.length} item(s)</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {r.items
                          .slice(0, 2)
                          .map((i) => i.orderItem.name)
                          .join(", ")}
                        {r.items.length > 2 ? ", ..." : ""}
                      </div>
                    </TableCell>
                    <TableCell className="truncate max-w-xs">
                      {r.reason || r.comment || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge status={r.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(r.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <ActionButton onClick={() => setSelected(r)}>
                          Open
                        </ActionButton>
                        {r.status !== "APPROVED" && (
                          <ActionButton
                            onClick={() => updateStatus(r.id, "APPROVED")}
                          >
                            Approve
                          </ActionButton>
                        )}
                        {r.status !== "REJECTED" && (
                          <ActionButton
                            onClick={() => updateStatus(r.id, "REJECTED")}
                          >
                            Reject
                          </ActionButton>
                        )}
                      </div>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-slate-500">Toplam: {total}</div>
          <div className="flex gap-2 items-center">
            <ActionButton
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Önceki
            </ActionButton>
            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              {page}
            </div>
            <ActionButton variant="ghost" onClick={() => setPage((p) => p + 1)}>
              Sonraki
            </ActionButton>
          </div>
        </footer>
      </div>

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

/* --- Utility Components --- */

function TableHeadCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200">
      {children}
    </th>
  );
}

function TableCell({
  children,
  colSpan,
  center,
  className,
}: {
  children: React.ReactNode;
  colSpan?: number;
  center?: boolean;
  className?: string;
}) {
  return (
    <td
      colSpan={colSpan}
      className={clsx(
        "p-3 align-middle",
        center && "text-center text-slate-500 dark:text-slate-400",
        className
      )}
    >
      {children}
    </td>
  );
}

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
          "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
      )}
    >
      {children}
    </button>
  );
}
