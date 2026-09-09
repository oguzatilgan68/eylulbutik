"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiClock,
  FiArrowLeft,
  FiCheck,
  FiExternalLink,
} from "react-icons/fi";

interface OrderDetailClientProps {
  id: string;
  isAdmin?: boolean;
}

export default function OrderDetailClient({
  id,
  isAdmin = false,
}: OrderDetailClientProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kargo formu state'leri (Yalnızca Admin için)
  const [trackingNo, setTrackingNo] = useState("");
  const [provider, setProvider] = useState("Yurtiçi Kargo");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Sipariş bulunamadı");
        const data = await res.json();
        setOrder(data);
        if (data.shipment) {
          setTrackingNo(data.shipment.trackingNo || "");
          setProvider(data.shipment.provider || "Yurtiçi Kargo");
        }
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdate = async (payload: Record<string, any>) => {
    if (!isAdmin) return;
    try {
      setUpdating(true);
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Güncelleme yapılamadı");
      const updatedData = await res.json();
      setOrder(updatedData);
    } catch (err: any) {
      alert(err.message || "Bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-3">
        <p className="text-rose-500 font-semibold">{error || "Sipariş bulunamadı."}</p>
        <Link
          href={isAdmin ? "/admin/orders" : "/account/orders"}
          className="text-sm text-pink-600 hover:underline inline-block"
        >
          ← Siparişlerime Dön
        </Link>
      </div>
    );
  }

  // Sipariş Durumu Etiketi (Müşteri için salt okunur rozet)
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      PAID: {
        label: "Sipariş Alındı / Hazırlanıyor",
        class: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50",
      },
      PENDING: {
        label: "Ödeme Bekleniyor",
        class: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50",
      },
      FULFILLED: {
        label: "Tamamlandı",
        class: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50",
      },
      CANCELLED: {
        label: "İptal Edildi",
        class: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50",
      },
    };
    const current = statusMap[status] || {
      label: status,
      class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold ${current.class}`}>
        {current.label}
      </span>
    );
  };

  const itemsSubtotal =
    order.items?.reduce(
      (sum: number, item: any) => sum + Number(item.unitPrice) * item.qty,
      0
    ) || 0;
  const grandTotal =
    order.total !== undefined && order.total !== null
      ? Number(order.total)
      : itemsSubtotal;

  const breadcrumbs = isAdmin
    ? [
        { label: "Admin", href: "/admin" },
        { label: "Siparişler", href: "/admin/orders" },
        { label: `Sipariş #${order.orderNo}` },
      ]
    : [
        { label: "Hesabım", href: "/account" },
        { label: "Siparişlerim", href: "/account/orders" },
        { label: `Sipariş #${order.orderNo}` },
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Üst Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Breadcrumb items={breadcrumbs} />
        <Link
          href={isAdmin ? "/admin/orders" : "/account/orders"}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
        >
          <FiArrowLeft size={14} /> Siparişlerime Dön
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sipariş Detayı: <span className="text-pink-600">#{order.orderNo}</span>
        </h1>

        {/* Admin ise Select Menü, Müşteri ise Salt Okunur Rozet */}
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <label
              htmlFor="orderStatus"
              className="text-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              Sipariş Durumu:
            </label>
            <select
              id="orderStatus"
              disabled={updating}
              value={order.status}
              onChange={(e) => handleUpdate({ status: e.target.value })}
              className="text-xs font-semibold px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition disabled:opacity-50 cursor-pointer"
            >
              <option value="PENDING">Ödeme Bekleniyor</option>
              <option value="PAID">Ödendi / Hazırlanıyor</option>
              <option value="FULFILLED">Tamamlandı</option>
              <option value="CANCELLED">İptal Edildi</option>
            </select>
          </div>
        ) : (
          <div>{getStatusBadge(order.status)}</div>
        )}
      </div>

      {/* Temel Bilgiler & Toplam Özeti */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Sipariş Numarası
          </span>
          <p className="font-bold text-gray-900 dark:text-white text-base mt-0.5">
            #{order.orderNo}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <FiClock size={13} /> {new Date(order.createdAt).toLocaleString("tr-TR")}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Alıcı Bilgisi
          </span>
          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mt-0.5">
            {order.user?.name || order.address?.fullName || "Bilinmiyor"}
          </p>
          <p className="text-xs text-gray-400">{order.user?.email}</p>
        </div>
        <div className="sm:text-right flex flex-col justify-center">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Toplam Tutar
          </span>
          <p className="text-xl font-extrabold text-pink-600 dark:text-pink-400 mt-0.5">
            {grandTotal.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </p>
        </div>
      </section>

      {/* Teslimat Adresi */}
      {order.address && (
        <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <FiMapPin className="text-pink-600" /> Teslimat Adresi
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 pt-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {order.address.fullName}
            </p>
            <p>Tel: {order.address.phone}</p>
            <p>{order.address.address1}</p>
            <p>
              {order.address.district} / {order.address.city}{" "}
              {order.address.zip ? `- ${order.address.zip}` : ""}
            </p>
          </div>
        </section>
      )}

      {/* Ürünler Listesi */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <FiPackage className="text-pink-600" /> Sipariş Edilen Ürünler
        </h2>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {order.items?.map((item: any) => {
            const productImage =
              item.variant?.images?.[0]?.url || item.product?.images?.[0]?.url;
            const targetUrl = isAdmin
              ? `/admin/products/${item.product?.id}`
              : `/product/${item.product?.slug}`;

            return (
              <li
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {productImage ? (
                    <Link
                      href={targetUrl}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm group block"
                    >
                      <Image
                        src={productImage}
                        alt={item.product?.name || "Ürün resmi"}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                      <FiPackage size={20} />
                    </div>
                  )}
                  <div>
                    <Link
                      href={targetUrl}
                      className="font-semibold text-gray-900 dark:text-white hover:text-pink-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      {item.product?.name || "Silinmiş Ürün"}
                      <FiExternalLink size={13} className="text-gray-400" />
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        SKU: {item.variant.sku}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Adet:{" "}
                      <strong className="text-gray-700 dark:text-gray-200">
                        {item.qty}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col justify-between items-center sm:items-end">
                  <span className="text-xs text-gray-400 sm:hidden">Tutar:</span>
                  <div>
                    <p className="text-xs text-gray-400">
                      {Number(item.unitPrice).toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}{" "}
                      / adet
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white text-base">
                      {(Number(item.unitPrice) * item.qty).toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Fiyat Özeti */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Ara Toplam:</span>
              <span>
                {itemsSubtotal.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                })}
              </span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Kargo:</span>
              <span className="text-emerald-600 font-medium">Ücretsiz</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 dark:border-gray-800 text-base font-bold text-gray-900 dark:text-white">
              <span>Genel Toplam:</span>
              <span className="text-xl text-pink-600 dark:text-pink-400">
                {grandTotal.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Kargo ve Ödeme Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kargo Kartı */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <FiTruck className="text-pink-600" /> Kargo Bilgileri
          </h2>

          {/* 🎯 SADECE ADMİN İÇİN FORM, MÜŞTERİ İÇİN BİLGİ KARTI */}
          {isAdmin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate({
                  provider,
                  trackingNo,
                  shipmentStatus: trackingNo ? "SHIPPED" : "PENDING",
                });
              }}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="provider"
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1"
                >
                  Kargo Firması
                </label>
                <input
                  id="provider"
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="Örn: Yurtiçi Kargo"
                  className="w-full text-sm px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label
                  htmlFor="trackingNo"
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1"
                >
                  Kargo Takip No
                </label>
                <input
                  id="trackingNo"
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="Takip kodunu yazın"
                  className="w-full text-sm font-mono px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
              >
                <FiCheck size={14} /> {updating ? "Kaydediliyor..." : "Kargo Bilgisini Kaydet"}
              </button>
            </form>
          ) : (
            // Müşteri Görünümü (Salt Okunur)
            <div className="space-y-3 text-sm">
              {order.shipment && order.shipment.trackingNo ? (
                <>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Kargo Firması:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {order.shipment.provider || "Belirtilmedi"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Takip Numarası:</span>
                    <span className="font-mono font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/40 px-2.5 py-1 rounded-lg">
                      {order.shipment.trackingNo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 dark:text-gray-400">Gönderi Durumu:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {order.shipment.status === "DELIVERED"
                        ? "Teslim Edildi"
                        : order.shipment.status === "SHIPPED"
                        ? "Kargoya Verildi"
                        : "Hazırlanıyor"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-gray-400 text-xs space-y-1">
                  <FiClock size={20} className="mx-auto text-gray-300 dark:text-gray-600 mb-1" />
                  <p className="font-medium text-gray-600 dark:text-gray-300">Siparişiniz hazırlanıyor</p>
                  <p>Kargoya verildiğinde takip numarası burada görünecektir.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Ödeme Kartı */}
        {order.payment && (
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiCreditCard className="text-pink-600" /> Ödeme Özeti
            </h2>
            <div className="text-sm space-y-2 pt-1">
              <p className="flex justify-between">
                <span className="text-gray-500">Durum:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {order.payment.status === "SUCCEEDED"
                    ? "Başarılı Ödeme"
                    : order.payment.status}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">İşlem Kodu:</span>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                  {order.payment.txId || "-"}
                </span>
              </p>
              <p className="flex justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Tahsil Edilen Tutar:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {grandTotal.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </span>
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}