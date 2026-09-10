import React from "react";
import clsx from "clsx";
import Link from "next/link";
import {
  Shipment,
  STATUSES,
} from "@/app/(marketing)/components/shipment/shipmentModal";
import { FiExternalLink, FiEdit2, FiTrash2, FiPackage, FiCalendar } from "react-icons/fi";

export function Table({
  list,
  loading,
  page,
  perPage,
  openEdit,
  handleDelete,
}: any) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50/75 dark:bg-gray-800/50 text-gray-400 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-100 dark:border-gray-800 sticky top-0">
            <tr>
              <th className="p-4 sm:px-6">#</th>
              <th className="p-4">Sipariş Bilgisi & Tarih</th>
              <th className="p-4">Kargo Firması</th>
              <th className="p-4">Takip Numarası</th>
              <th className="p-4">Durum</th>
              <th className="p-4">Raw Veri</th>
              <th className="p-4 text-right sm:pr-6">Eylemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                    <span>Gönderiler yükleniyor...</span>
                  </div>
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FiPackage size={28} className="text-gray-300 dark:text-gray-700" />
                    <p className="text-sm font-medium">Kayıtlı kargo gönderisi bulunamadı.</p>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((s: Shipment & { order?: { orderNo: string; createdAt: string; total: number } }, i: number) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors group"
                >
                  <td className="p-4 sm:px-6 align-middle font-medium text-gray-400 text-xs">
                    {(page - 1) * perPage + i + 1}
                  </td>

                  {/* 🎯 Sipariş Numarası ve Tarihi (Direkt Tıklanabilir Detay) */}
                  <td className="p-4 align-middle">
                    <div className="space-y-0.5">
                      <Link
                        href={`/admin/orders/${s.orderId}`}
                        className="font-bold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>#{s.order?.orderNo || "Sipariş Silinmiş"}</span>
                        <FiExternalLink size={13} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FiCalendar size={12} />
                        <span>
                          {s.order?.createdAt
                            ? new Date(s.order.createdAt).toLocaleString("tr-TR", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 align-middle">
                    <Badge text={s.provider} />
                  </td>

                  <td className="p-4 align-middle font-mono font-medium text-xs text-gray-700 dark:text-gray-300">
                    {s.trackingNo ? (
                      <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        {s.trackingNo}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Takip no yok</span>
                    )}
                  </td>

                  <td className="p-4 align-middle">
                    <StatusBadge status={s.status} />
                  </td>

                  <td
                    className="p-4 align-middle max-w-xs truncate text-xs text-gray-500 font-mono"
                    title={JSON.stringify(s.raw || "")}
                  >
                    {s.raw
                      ? JSON.stringify(s.raw).slice(0, 50) +
                        (JSON.stringify(s.raw).length > 50 ? "..." : "")
                      : "-"}
                  </td>

                  <td className="p-4 sm:pr-6 align-middle text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <ActionButton onClick={() => openEdit(s)} title="Düzenle">
                        <FiEdit2 size={14} />
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleDelete(s.id)}
                        title="Sil"
                      >
                        <FiTrash2 size={14} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */
function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/30">
      {text}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find((x) => x.value === status);
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold shadow-xs",
        s?.color || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        "p-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-center shadow-xs",
        variant === "default"
          ? "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-700"
          : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200/60 dark:border-rose-900/30"
      )}
    >
      {children}
    </button>
  );
}