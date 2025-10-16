"use client";
import ReturnItemList from "./ReturnItemList";
import Badge from "./Badge";
import ActionButton from "./ActionButton";

export default function ReturnDetailsModal({
  returnRequest,
  onClose,
  onUpdate,
}: {
  returnRequest: any;
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
                returnRequest.user?.phone}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {returnRequest.user?.email}
            </div>
          </div>
          <div>
            <div className="font-medium">İade Sebebi</div>
            <div className="text-slate-600 dark:text-slate-300">
              {returnRequest.comment || "-"}
            </div>
          </div>
          <div>
            <div className="font-medium mb-2">Ürünler</div>
            <ReturnItemList items={returnRequest.items} />
          </div>
          <div>
            <div className="font-medium">Durum</div>
            <Badge status={returnRequest.status} />
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
              Onayla
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
