"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Order {
  id: string;
  orderNo: string;
  items: any[];
}

export default function MyReviews() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/finished-orders");
        if (!res.ok) throw new Error("Siparişler alınamadı");
        const json = await res.json();
        const data = json.data || [];
        const normalized = data.map((o: any) => ({
          ...o,
          items: o.items || [],
        }));
        setOrders(normalized);
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function handleSave(orderId: string, productId: string) {
    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId, content, rating }),
      });
      if (!res.ok) throw new Error("Yorum gönderilemedi");

      // Success → state update
      setOrders((prev) =>
        prev.map((o) => ({
          ...o,
          items: o.items.map((i: any) =>
            i.product.id === productId
              ? {
                  ...i,
                  review: {
                    content,
                    rating,
                    createdAt: new Date(),
                    isApproved: false,
                  },
                }
              : i
          ),
        }))
      );

      // Modalı kapat
      setShowModal(false);
      setSelectedProduct(null);
      setContent("");
      setRating(0);
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (!orders || orders.length === 0)
    return (
      <p>
        Henüz tamamlanan siparişiniz yok veya yorum yapabileceğiniz sipariş yok.
      </p>
    );

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg">
          {/* Sipariş başlığı */}
          <button
            className="w-full text-left p-4 font-semibold bg-gray-100 dark:bg-gray-700 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() =>
              setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
            }
          >
            Sipariş No: {order.orderNo}
          </button>

          {/* Ürünler toggle */}
          {expandedOrderId === order.id && (
            <div className="p-4 space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-3 border rounded"
                >
                  {/* Ürün görseli */}
                  <Link
                    href={`/product/${item.product?.slug || "#"}`}
                    className="shrink-0"
                  >
                    <div className="relative w-24 h-24 rounded overflow-hidden">
                      <Image
                        src={
                          item.product?.images?.[0]?.url || "/placeholder.png"
                        }
                        alt={item.product?.name || "Ürün"}
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* İçerik */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/product/${item.product?.slug || "#"}`}
                        className="font-semibold hover:underline"
                      >
                        {item.product?.name || "Ürün"}
                      </Link>
                    </div>

                    {/* Yorum veya Yorum Yap */}
                    {item.product?.Review && item.product.Review.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-yellow-500 text-sm">
                          {"⭐".repeat(item.product.Review[0].rating)}
                        </span>
                        <p>{item.product.Review[0].content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            item.product.Review[0].createdAt
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {item.product.Review[0].isApproved
                            ? "Onaylandı"
                            : "Onay Bekliyor"}
                        </span>
                      </div>
                    ) : (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 mt-2 sm:mt-0"
                        onClick={() => {
                          setSelectedProduct({ ...item, orderId: order.id });
                          setShowModal(true);
                        }}
                      >
                        Yorum Yap
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            {/* Close */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* Ürün bilgisi */}
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={
                  selectedProduct.product?.images?.[0]?.url ||
                  "/placeholder.png"
                }
                alt={selectedProduct.product?.name || "Ürün"}
                width={80}
                priority
                height={80}
                className="rounded object-cover"
              />
              <h3 className="font-semibold">{selectedProduct.product?.name}</h3>
            </div>

            {/* Yıldız rating */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Yorum */}
            <textarea
              className="border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="Ürün hakkında yorumunuzu yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() =>
                handleSave(selectedProduct.orderId, selectedProduct.product?.id)
              }
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
