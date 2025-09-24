"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; // Kapatma ikonu

interface ModalClientProps {
  orderId: string;
  orderItems: { id: string; name: string; qty: number }[];
  onClose: () => void;
}

// Enum değerleri client tarafında array olarak
const RETURN_REASONS = [
  { label: "Ürün Defolu / Hasarlı", value: "PRODUCT_DEFECT" },
  { label: "Yanlış Ürün Gönderildi", value: "WRONG_ITEM_SENT" },
  { label: "Kargo Gecikmesi", value: "SHIPPING_DELAY" },
  { label: "Ürünü Beğenmedim", value: "DONTLIKE_ITEM" },
  { label: "Diğer", value: "OTHER" },
];

export default function ReturnRequestModal({
  orderId,
  orderItems,
  onClose,
}: ModalClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(
    orderItems.map((item) => ({ ...item, returnQty: 0, reason: "" }))
  );
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    // Ürün bazlı reason kontrolü
    for (const item of selectedItems.filter((i) => i.returnQty > 0)) {
      if (!item.reason) {
        alert(`Lütfen "${item.name}" için bir iade sebebi seçin.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          comment,
          items: selectedItems
            .filter((item) => item.returnQty > 0)
            .map((item) => ({
              orderItemId: item.id,
              qty: item.returnQty,
              reason: item.reason,
            })),
        }),
      });

      if (!res.ok) throw new Error("Iade oluşturulamadı");
      onClose();
      router.push("/account/refund"); // Başarılıysa yönlendir
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-[500px] max-w-full relative">
        {/* Kapatma ikonu */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          İade Talebi Oluştur
        </h2>

        {selectedItems.map((item, idx) => (
          <div key={item.id} className="mb-2">
            <p className="text-gray-800 dark:text-gray-200">
              {item.name} (Mevcut: {item.qty})
            </p>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                min={0}
                max={item.qty}
                value={item.returnQty}
                onChange={(e) =>
                  setSelectedItems((prev) => {
                    const copy = [...prev];
                    copy[idx].returnQty = parseInt(e.target.value) || 0;
                    return copy;
                  })
                }
                className="border border-gray-300 dark:border-gray-600 p-1 w-20 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={item.reason}
                onChange={(e) =>
                  setSelectedItems((prev) => {
                    const copy = [...prev];
                    copy[idx].reason = e.target.value;
                    return copy;
                  })
                }
                className="border border-gray-300 dark:border-gray-600 p-1 w-[250px] rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">-- Sebep Seçin --</option>
                {RETURN_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <textarea
          placeholder="Genel yorum / açıklama"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 w-full p-2 mt-2 mb-4 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Gönderiliyor..." : "İade Talebi Oluştur"}
          </button>
        </div>
      </div>
    </div>
  );
}
