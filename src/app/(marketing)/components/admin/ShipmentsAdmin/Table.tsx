import React from "react";
import clsx from "clsx";
import {
  Shipment,
  STATUSES,
} from "@/app/(marketing)/components/shipment/shipmentModal";

export function Table({
  list,
  loading,
  page,
  perPage,
  openEdit,
  handleDelete,
}: any) {
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

/* ---------------- Helper Components ---------------- */
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
