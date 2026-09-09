"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiRotateCcw, FiCheck, FiPackage } from "react-icons/fi";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
}

function NewReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchItems = async () => {
      try {
        setFetchingItems(true);
        const res = await fetch(`/api/orders/${orderId}/items`);
        if (res.ok) {
          const data: OrderItem[] = await res.json();
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setFetchingItems(false);
      }
    };

    fetchItems();
  }, [orderId]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || selectedItems.length === 0) {
      alert("Lütfen iade edilecek en az bir ürün seçin.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          items: selectedItems.map((id) => ({ orderItemId: id, qty: 1 })),
          reason,
          comment,
        }),
      });

      if (res.ok) {
        router.push("/account/returns");
      } else {
        const err = await res.json();
        alert(err?.error || "İade talebi oluşturulamadı");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiRotateCcw className="text-pink-600" /> Yeni İade Talebi Oluştur
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          İade etmek istediğiniz ürünleri seçin ve sebebi belirtin.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5"
      >
        {/* Ürün seçimi */}
        <div>
          <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            İade Edilecek Ürünler *
          </label>
          {fetchingItems ? (
            <div className="p-8 text-center text-gray-400 text-sm">Ürünler yükleniyor...</div>
          ) : items.length > 0 ? (
            <div className="space-y-2.5">
              {items.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-pink-500 bg-pink-50/40 dark:bg-pink-950/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // parent div handle ediyor
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      Adet: {item.qty}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              Sipariş ürünleri bulunamadı.
            </div>
          )}
        </div>

        {/* İade sebebi */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            İade Sebebi *
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={inputClass}
            placeholder="Örn: Ürün beklentilerimi karşılamadı / Beden uymadı"
            required
          />
        </div>

        {/* Ek açıklama */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Ek Açıklama (Opsiyonel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder="Varsa ek detayları belirtebilirsiniz..."
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={loading || selectedItems.length === 0}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <FiCheck size={16} />
            {loading ? "Gönderiliyor..." : "İade Talebini Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewReturnPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Yükleniyor...</div>}>
      <NewReturnContent />
    </Suspense>
  );
}