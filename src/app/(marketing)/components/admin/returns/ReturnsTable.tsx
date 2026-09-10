"use client";

import Badge from "./Badge";
import ActionButton from "./ActionButton";
import { ReturnRequestWithRelations } from "./types";
import { FiPackage, FiCalendar, FiEye, FiCheck, FiX } from "react-icons/fi";

interface ReturnsTableProps {
  list: ReturnRequestWithRelations[];
  onSelect: (r: ReturnRequestWithRelations) => void;
  onUpdate: (id: string, status: string) => void;
}

export default function ReturnsTable({
  list,
  onSelect,
  onUpdate,
}: ReturnsTableProps) {
  if (list.length === 0) {
    return (
      <div className="hidden sm:block bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center text-gray-400">
        <p className="text-sm font-medium">Görüntülenecek iade talebi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="hidden sm:block bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50/75 dark:bg-gray-800/50 text-gray-400 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-100 dark:border-gray-800 sticky top-0">
            <tr>
              <th className="px-6 py-4">Müşteri</th>
              <th className="px-6 py-4">Talep Edilen Ürün(ler)</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4">Açıklama / Yorum</th>
              <th className="px-6 py-4 text-right pr-6">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {list.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
              >
                {/* Müşteri */}
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {(r.user?.fullName || r.user?.email || "M")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs">
                        {r.user?.fullName || "Misafir Kullanıcı"}
                      </p>
                      <p className="text-[11px] text-gray-400">{r.user?.email || r.user?.phone || "-"}</p>
                    </div>
                  </div>
                </td>

                {/* Ürünler ve Görselleri */}
                <td className="px-6 py-4 align-middle">
                  <div className="flex flex-col gap-2">
                    {r.items.map((i) => {
                      const imageUrl = i.orderItem.product?.images?.[0]?.url;
                      const variantInfo = i.orderItem.variant;

                      return (
                        <div key={i.id} className="flex items-center gap-3">
                          {/* Ürün Küçük Görseli */}
                          {imageUrl ? (
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0 shadow-xs">
                              <img src={imageUrl} alt={i.orderItem.name} className="object-cover w-full h-full" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                              <FiPackage size={16} />
                            </div>
                          )}

                          {/* Ürün Adı, Adeti ve Varyantı */}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-white text-xs">
                              <span className="font-semibold text-gray-900 dark:text-white text-xs">
                                {i.qty}x {i.orderItem.name}
                              </span>                            </span>
                            {variantInfo && (
                              <span className="text-[11px] text-gray-400 font-mono">
                                {typeof variantInfo === "object" ? JSON.stringify(variantInfo) : variantInfo}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </td>

                {/* Durum */}
                <td className="px-6 py-4 align-middle">
                  <Badge status={r.status} />
                </td>

                {/* Tarih */}
                <td className="px-6 py-4 align-middle text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={13} className="text-gray-400" />
                    {new Date(r.createdAt).toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </td>

                {/* Yorum */}
                <td className="px-6 py-4 align-middle max-w-xs truncate text-xs text-gray-600 dark:text-gray-300" title={r.comment || ""}>
                  {r.comment || <span className="text-gray-400 italic">Yorum yok</span>}
                </td>

                {/* Aksiyonlar */}
                <td className="px-6 py-4 align-middle text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <ActionButton onClick={() => onSelect(r)} title="Detay">
                      <FiEye size={14} /> Detay
                    </ActionButton>
                    {r.status !== "APPROVED" && (
                      <ActionButton onClick={() => onUpdate(r.id, "APPROVED")} variant="success" title="Onayla">
                        <FiCheck size={14} /> Onayla
                      </ActionButton>
                    )}
                    {r.status !== "REJECTED" && (
                      <ActionButton onClick={() => onUpdate(r.id, "REJECTED")} variant="danger" title="Reddet">
                        <FiX size={14} /> Reddet
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
  );
}