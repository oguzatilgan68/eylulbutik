"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Review {
  id?: string;
  productId?: string;
  userId?: string;
  content: string;
  rating: number;
  createdAt: string | Date;
  isApproved: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
  reviews?: Review[]; // ürünün tüm yorumları
}

interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  variantId?: string | null;
  name?: string;
  qty?: number;
  unitPrice?: string | number;
  product: Product;
  review?: Review | null; // kullanıcının kendi yorumu (normalize edilecek)
}

interface Order {
  id: string;
  orderNo: string;
  userId?: string; // önemli — hangi kullanıcının siparişi olduğunu bilmek için
  items: OrderItem[];
  createdAt?: string;
  status?: string;
}

export default function MyReviews() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    (OrderItem & { orderId: string }) | null
  >(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  // Success message
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/finished-orders");
        if (!res.ok) throw new Error("Siparişler alınamadı");
        const json = await res.json();
        const rawData: any[] = json.data || [];

        // Normalize: her item için kullanıcının kendi review'ünü item.review'e yerleştir
        const normalized: Order[] = rawData.map((o) => {
          const items: OrderItem[] = (o.items || []).map((i: any) => {
            const product: Product = i.product || {
              id: "",
              name: "",
              slug: "",
              images: [],
              reviews: [],
            };

            // Öncelik: aynı kullanıcıya ait review (order.userId ile eşleştir)
            const userReview =
              product.reviews?.find((r) => {
                // bazı api yanıtları userId string döndürebilir; null/undefined koru
                return !!(r.userId && o.userId && r.userId === o.userId);
              }) ?? null;

            return {
              ...i,
              product,
              review: userReview,
            };
          });

          return {
            ...o,
            items,
          };
        });

        setOrders(normalized);
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  function resetModal() {
    setShowModal(false);
    setSelectedProduct(null);
    setContent("");
    setRating(0);
    setHoverRating(0);
  }

  async function handleSave(orderId: string, productId?: string) {
    if (!productId) return alert("Ürün bulunamadı");

    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId, content, rating }),
      });
      if (!res.ok) {
        // mümkünse backend error mesajını göster
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Yorum gönderilemedi");
      }

      // Başarılıysa local state'e ekle (backend de sonradan dönmeye devam ederse kalıcı olur)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                items: o.items.map((i) =>
                  i.product.id === productId
                    ? {
                        ...i,
                        review: {
                          id: undefined,
                          productId,
                          userId: o.userId,
                          content,
                          rating,
                          createdAt: new Date().toISOString(),
                          isApproved: false,
                        },
                      }
                    : i
                ),
              }
            : o
        )
      );

      setSuccess("Yorumunuz kaydedildi, onay bekleniyor.");
      setTimeout(() => setSuccess(null), 3000);

      resetModal();
    } catch (err: any) {
      alert(err.message || "Bir hata oluştu");
    }
  }

  if (loading) return <p className="p-4 text-gray-600">Yükleniyor...</p>;
  if (error) return <p className="p-4 text-red-600">Hata: {error}</p>;
  if (!orders || orders.length === 0)
    return (
      <p className="p-4 text-gray-600">
        Henüz tamamlanan siparişiniz yok veya yorum yapabileceğiniz sipariş
        bulunamadı.
      </p>
    );

  return (
    <div className="space-y-4">
      {success && (
        <div className="p-3 rounded bg-green-100 text-green-700">{success}</div>
      )}

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
              {order.items.length === 0 && (
                <div className="text-sm text-gray-500">
                  Bu siparişte ürün yok.
                </div>
              )}

              {order.items.map((item) => (
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

                    {/* Yorum veya Yorum Yap (item.review kullan) */}
                    {item.review ? (
                      <div className="space-y-1">
                        <span className="text-yellow-500 text-sm">
                          {"⭐".repeat(
                            Math.max(0, Math.min(5, item.review.rating || 0))
                          )}
                        </span>
                        <p>{item.review.content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(item.review.createdAt).toLocaleDateString()}{" "}
                          -{" "}
                          {item.review.isApproved
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
              onClick={resetModal}
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
                height={80}
                priority
                className="rounded object-cover"
              />
              <h3 className="font-semibold">{selectedProduct.product?.name}</h3>
            </div>

            {/* Yıldız rating */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  role="button"
                  aria-label={`${star} yıldız`}
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
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() =>
                handleSave(selectedProduct.orderId, selectedProduct.product?.id)
              }
              disabled={!rating || !content.trim()}
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
