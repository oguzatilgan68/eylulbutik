"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  code: string;
}

interface OrderItem {
  id: string;
  name: string;
  qty: number;
}

export default function NewReturnPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Siparişleri getir
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Siparişler alınamadı", err);
      }
    };
    fetchOrders();
  }, []);

  // Sipariş seçildiğinde ilgili ürünleri getir
  useEffect(() => {
    if (!selectedOrder) return;
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/orders/${selectedOrder}/items`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error("Sipariş ürünleri alınamadı", err);
      }
    };
    fetchItems();
  }, [selectedOrder]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder,
          items: selectedItems.map((id) => ({ orderItemId: id, qty: 1 })),
          reason,
          comment,
        }),
      });

      if (res.ok) {
        router.push("/account/returns");
      } else {
        alert("İade talebi oluşturulamadı");
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
        {/* Sipariş seçimi */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Sipariş
          </label>
          <select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            required
          >
            <option value="">Seçiniz</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.code}
              </option>
            ))}
          </select>
        </div>

        {/* Ürün seçimi */}
        {selectedOrder && (
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
        )}

        {/* Genel sebep */}
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
