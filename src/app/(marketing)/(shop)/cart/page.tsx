"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiTrash2, FiShoppingBag, FiPlus, FiMinus, FiArrowRight } from "react-icons/fi";
import Swal from "sweetalert2";
import OrderSummary from "../../components/ui/OrderSummary";

interface CartItem {
  id: string;
  product: {
    name: string;
    images: { url: string }[];
    slug: string;
  };
  variant?: {
    attributes: {
      id: string;
      value: string;
      attributeType?: { id: string; name: string };
    }[];
  } | null;
  qty: number;
  unitPrice: number | string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sepeti çek
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Beklenmeyen hata oluştu");
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err) {
        console.error("Sepet alınırken hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [router]);

  // Ara toplam hesapla
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = Number(item.unitPrice) || 0;
      return acc + price * item.qty;
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  // Miktar güncelle
  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    setLoading(true);
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId: itemId, action: "update", qty }),
      });
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, qty } : i))
      );
    } finally {
      setLoading(false);
    }
  };

  // Ürün sil
  const removeItem = async (itemId: string) => {
    const result = await Swal.fire({
      title: "Ürünü sepetten kaldırmak istiyor musunuz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, kaldır",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await fetch("/api/cart/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId: itemId, action: "remove" }),
        });
        setCartItems((prev) => prev.filter((i) => i.id !== itemId));
        Swal.fire({
          icon: "success",
          title: "Ürün kaldırıldı",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Yükleniyor ekranı
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
          <span>Sepetiniz yükleniyor...</span>
        </div>
      </div>
    );
  }

  // Sepet boş ekranı
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto shadow-inner">
          <FiShoppingBag size={28} />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Sepetiniz Boş
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Henüz sepetinize herhangi bir ürün eklemediniz.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all mt-2"
        >
          Alışverişe Başla <FiArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Normal sepet ekranı
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiShoppingBag className="text-pink-600" /> Alışveriş Sepeti
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Sepetinizdeki ürünleri inceleyin ve siparişinizi tamamlayın.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl">
          {cartItems.length} Çeşit Ürün
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol taraf: Ürünler Listesi */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => {
            const price = Number(item.unitPrice) || 0;
            const lineTotal = (price * item.qty).toFixed(2);

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:border-pink-500/40"
              >
                {/* Ürün Görseli */}
                <Link href={`/product/${item.product.slug}`} className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={item.product.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </Link>

                {/* Ürün Bilgileri */}
                <div className="flex-1 w-full sm:w-auto space-y-1">
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="font-semibold text-base text-gray-900 dark:text-white hover:text-pink-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>

                  {item.variant?.attributes?.length ? (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.variant.attributes.map((attr, i) => (
                        <span key={attr.id} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                          <strong>{attr.attributeType?.name}:</strong> {attr.value}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className="font-bold text-pink-600 dark:text-pink-400 text-base pt-1">
                    {lineTotal} ₺
                  </p>
                </div>

                {/* Adet Kontrolü & Silme */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-40 cursor-pointer shadow-sm"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm dark:text-white">
                      {item.qty}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer shadow-sm"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer"
                    title="Ürünü kaldır"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sağ taraf: Sipariş Özeti */}
        <div className="w-full lg:w-96 shrink-0 sticky top-20 h-max">
          <OrderSummary
            subtotal={subtotal}
            showCheckoutButton={true}
            onApply={(d) => setDiscount(d)}
            onCheckout={() => router.push("/checkout")}
          />
        </div>
      </div>
    </div>
  );
}