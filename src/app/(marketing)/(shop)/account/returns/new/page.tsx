"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
}

export default function NewReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (!searchParams) return null;
  const orderId = searchParams.get("orderId");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Sipariş ürünlerini fetch et
  useEffect(() => {
    if (!orderId) return;
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/items`);
        if (res.ok) {
          const data: OrderItem[] = await res.json();
          setItems(data);
        } else {
          console.error("Sipariş ürünleri alınamadı:", res.statusText);
          setItems([]);
        }
      } catch (err) {
        console.error("Sipariş ürünleri alınamadı:", err);
        setItems([]);
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
      alert("Lütfen iade edilecek ürünleri seçin");
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4 dark:text-gray-100">
        Yeni İade Talebi
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ürün seçimi */}
        {items.length > 0 ? (
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Ürünler
            </label>
            <div className="space-y-2">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 dark:text-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span>
                    {item.name} (x{item.qty})
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <p>Ürünler yükleniyor veya bulunamadı.</p>
        )}

        {/* İade sebebi */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            İade Sebebi
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            placeholder="Örn: Ürün beklentilerimi karşılamadı"
            required
          />
        </div>

        {/* Ek açıklama */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Açıklama
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            rows={3}
            placeholder="Opsiyonel"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Gönderiliyor..." : "İade Talebi Oluştur"}
        </button>
      </form>
    </div>
  );
}
