"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageSquare, CheckCircle2, Clock, ChevronDown, ChevronUp, X, Sparkles, Send } from "lucide-react";

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
  reviews?: Review[];
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
  review?: Review | null;
}

interface Order {
  id: string;
  orderNo: string;
  userId?: string;
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
  const [rating, setRating] = useState<number>(5);
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

        const normalized: Order[] = rawData.map((o) => {
          const items: OrderItem[] = (o.items || []).map((i: any) => {
            const product: Product = i.product || {
              id: "",
              name: "",
              slug: "",
              images: [],
              reviews: [],
            };

            const userReview =
              product.reviews?.find((r) => {
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
    setRating(5);
    setHoverRating(0);
  }

  async function handleSave(orderId: string, productId?: string) {
    if (!productId) return alert("Ürün bulunamadı");
    if (!content.trim()) return alert("Lütfen değerlendirmenizi yazın.");

    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId, content, rating }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Yorum gönderilemedi");
      }

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

      setSuccess("Yorumunuz başarıyla kaydedildi, onay sonrası yayınlanacaktır. ✨");
      setTimeout(() => setSuccess(null), 4000);

      resetModal();
    } catch (err: any) {
      alert(err.message || "Bir hata oluştu");
    }
  }

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-sm font-medium border border-rose-200 dark:border-rose-900">
        Hata: {error}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-2">
          <MessageSquare size={22} />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">Değerlendirilecek Sipariş Yok</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Henüz yorum yapabileceğiniz tamamlanmış bir siparişiniz bulunmuyor.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Üst Başlık */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-pink-600" /> Ürün Değerlendirmelerim
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Satın aldığınız ürünleri puanlayın ve deneyimlerinizi diğer müşterilerle paylaşın.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-sm font-semibold border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
          <CheckCircle2 size={18} /> {success}
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;

          return (
            <div key={order.id} className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden transition-all">
              {/* Sipariş Akordeon Başlığı */}
              <button
                type="button"
                className="w-full text-left p-5 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedOrderId(isExpanded ? null : order.id)
                }
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    Sipariş #{order.orderNo}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({order.items.length} Ürün)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <span>{isExpanded ? "Gizle" : "Ürünleri Gör"}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Ürünler Listesi */}
              {isExpanded && (
                <div className="p-6 space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                  {order.items.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-4">
                      Bu siparişte ürün bulunmuyor.
                    </div>
                  )}

                  {order.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 ${idx > 0 ? "pt-4" : ""}`}
                    >
                      {/* Ürün Görseli ve Bilgisi */}
                      <div className="flex items-start gap-4">
                        <Link
                          href={`/product/${item.product?.slug || "#"}`}
                          className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm"
                        >
                          <Image
                            src={
                              item.product?.images?.[0]?.url || "/placeholder.png"
                            }
                            alt={item.product?.name || "Ürün"}
                            fill
                            className="object-cover"
                          />
                        </Link>

                        <div className="space-y-1">
                          <Link
                            href={`/product/${item.product?.slug || "#"}`}
                            className="font-semibold text-sm text-gray-900 dark:text-white hover:text-pink-600 transition-colors line-clamp-2"
                          >
                            {item.product?.name || "Ürün"}
                          </Link>
                          <p className="text-xs text-gray-400">
                            Adet: {item.qty || 1}
                          </p>
                        </div>
                      </div>

                      {/* Yorum Durumu veya Yorum Yap Butonu */}
                      <div className="w-full sm:w-auto shrink-0">
                        {item.review ? (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5 min-w-[240px]">
                            <div className="flex items-center justify-between">
                              <div className="flex text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < (item.review?.rating || 0)
                                        ? "fill-yellow-400"
                                        : "stroke-gray-300 dark:stroke-gray-700 fill-transparent"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                item.review.isApproved 
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" 
                                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                              }`}>
                                {item.review.isApproved ? "Onaylandı" : "Onay Bekliyor"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                              "{item.review.content}"
                            </p>
                            <span className="text-[10px] text-gray-400 block pt-1 border-t border-gray-100 dark:border-gray-800">
                              {new Date(item.review.createdAt).toLocaleDateString("tr-TR")}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                            onClick={() => {
                              setSelectedProduct({ ...item, orderId: order.id });
                              setShowModal(true);
                            }}
                          >
                            <MessageSquare size={14} /> Ürünü Değerlendir
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modern Yorum Yazma Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Ürün Değerlendirmesi
              </h2>
              <button
                type="button"
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 transition-colors"
                onClick={resetModal}
              >
                <X size={18} />
              </button>
            </div>

            {/* Ürün Bilgisi */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <Image
                  src={
                    selectedProduct.product?.images?.[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={selectedProduct.product?.name || "Ürün"}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                {selectedProduct.product?.name}
              </h3>
            </div>

            {/* Yıldız Puanlama */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Puanınız *
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-7 h-7 cursor-pointer transition-transform hover:scale-110 ${
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 stroke-yellow-400"
                        : "stroke-gray-300 dark:stroke-gray-700 fill-transparent"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>

            {/* Yorum İçeriği */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Yorumunuz *
              </label>
              <textarea
                className={`${inputClass} min-h-[120px] resize-y`}
                placeholder="Ürünün kalitesi, kumaşı veya kalıbı hakkında deneyimlerinizi yazın..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={resetModal}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
                onClick={() =>
                  handleSave(selectedProduct.orderId, selectedProduct.product?.id)
                }
                disabled={!rating || !content.trim()}
              >
                <Send size={16} /> Yorumu Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}