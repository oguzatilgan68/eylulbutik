"use client";

import Badge from "./Badge";
import ActionButton from "./ActionButton";
import { ReturnRequestWithRelations } from "./types";
import { FiPackage, FiCalendar, FiEye, FiCheck, FiX } from "react-icons/fi";

interface ReturnsCardsProps {
  list: ReturnRequestWithRelations[];
  onSelect: (r: ReturnRequestWithRelations) => void;
  onUpdate: (id: string, status: string) => void;
}

export default function ReturnsCards({
  list,
  onSelect,
  onUpdate,
}: ReturnsCardsProps) {
  if (list.length === 0) {
    return (
      <div className="grid sm:hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 text-center text-gray-400">
        <p className="text-sm font-medium">Görüntülenecek iade talebi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:hidden">
      {list.map((r) => (
        <div
          key={r.id}
          className="p-5 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-3"
        >
          {/* Üst Kısım: Müşteri Adı ve Durum Rozeti */}
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                {r.user?.fullName || "Misafir Kullanıcı"}
              </h3>
              <p className="text-xs text-gray-400">{r.user?.email || r.user?.phone || "-"}</p>
            </div>
            <Badge status={r.status} />
          </div>

          {/* Ürün ve Tarih Bilgisi */}
{/* Ürün ve Tarih Bilgisi */}
<div className="flex flex-col gap-2.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
  <div className="flex flex-col gap-2">
    {r.items.map((i) => {
      const imageUrl = i.orderItem.product?.images?.[0]?.url;
      const variantInfo = i.orderItem.variant;

      return (
        <div key={i.id} className="flex items-center gap-2.5">
          {imageUrl ? (
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0 shadow-xs">
              <img src={imageUrl} alt={i.orderItem.name} className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
              <FiPackage size={14} />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white text-xs">
              {i.qty}x {i.orderItem.name}
            </span>
            {variantInfo && (
              <span className="text-[10px] text-gray-400 font-mono">
                {typeof variantInfo === "object" ? JSON.stringify(variantInfo) : variantInfo}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
  
  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 mt-0.5">
    <FiCalendar size={12} />
    <span>{new Date(r.createdAt).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}</span>
  </div>
</div>

          {/* Yorum Alanı */}
          {r.comment && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic px-1">
              &ldquo;{r.comment}&rdquo;
            </p>
          )}

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <ActionButton onClick={() => onSelect(r)}>
              <FiEye size={14} /> Detay
            </ActionButton>
            {r.status !== "APPROVED" && (
              <ActionButton onClick={() => onUpdate(r.id, "APPROVED")} variant="success">
                <FiCheck size={14} /> Onayla
              </ActionButton>
            )}
            {r.status !== "REJECTED" && (
              <ActionButton onClick={() => onUpdate(r.id, "REJECTED")} variant="danger">
                <FiX size={14} /> Reddet
              </ActionButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}