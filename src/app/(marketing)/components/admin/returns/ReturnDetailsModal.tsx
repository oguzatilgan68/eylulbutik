"use client";
import ReturnItemList from "./ReturnItemList";
import Badge from "./Badge";
import ActionButton from "./ActionButton";
import { FiX, FiUser, FiMessageSquare, FiCalendar, FiPackage, FiShield, FiCheck, FiXCircle } from "react-icons/fi";

export default function ReturnDetailsModal({
  returnRequest,
  onClose,
  onUpdate,
}: {
  returnRequest: any;
  onClose: () => void;
  onUpdate: (id: string, status: string) => void;
}) {
  if (!returnRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-2xl">
              <FiShield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                İade Talebi Detayı
              </h2>
              <p className="text-xs text-gray-400">Talebe ait tüm detayları ve ürünleri inceleyin.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Müşteri Bilgisi Kartı */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              <FiUser size={13} className="text-pink-600" /> Müşteri Bilgisi
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-base">
              {returnRequest.user?.fullName || "Misafir Kullanıcı"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {returnRequest.user?.email || returnRequest.user?.phone || "-"}
            </div>
          </div>

          {/* İade Sebebi / Yorum */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              <FiMessageSquare size={13} className="text-pink-600" /> İade Sebebi / Açıklama
            </div>
            <div className="text-gray-700 dark:text-gray-300 italic text-xs leading-relaxed">
              &ldquo;{returnRequest.comment || "Müşteri bir açıklama belirtmemiş."}&rdquo;
            </div>
          </div>

          {/* Ürünler */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <FiPackage size={13} className="text-pink-600" /> İade Edilen Ürünler
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 border border-gray-100 dark:border-gray-800">
              <ReturnItemList items={returnRequest.items} />
            </div>
          </div>

          {/* Durum ve Tarih Bilgisi (Grid Yapısı) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1.5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mevcut Durum</div>
              <div><Badge status={returnRequest.status} /></div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <FiCalendar size={13} className="text-pink-600" /> Oluşturulma Tarihi
              </div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {new Date(returnRequest.createdAt).toLocaleString("tr-TR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-3xl">
          {returnRequest.status !== "APPROVED" && (
            <ActionButton
              variant="success"
              onClick={() => onUpdate(returnRequest.id, "APPROVED")}
            >
              <FiCheck size={14} /> Onayla
            </ActionButton>
          )}
          {returnRequest.status !== "REJECTED" && (
            <ActionButton
              variant="danger"
              onClick={() => onUpdate(returnRequest.id, "REJECTED")}
            >
              <FiXCircle size={14} /> Reddet
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