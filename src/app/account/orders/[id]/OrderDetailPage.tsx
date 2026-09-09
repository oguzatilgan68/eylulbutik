"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { FiPackage, FiMapPin, FiCreditCard, FiTruck, FiClock, FiArrowLeft } from "react-icons/fi";

export default function OrderDetailClient({ id }: { id: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Sipariş bulunamadı");
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-3">
        <p className="text-rose-500 font-semibold">{error}</p>
        <Link href="/account/orders" className="text-sm text-pink-600 hover:underline inline-block">
          ← Siparişlerime Geri Dön
        </Link>
      </div>
    );
  }

  if (!order) {
    return <p className="p-12 text-center text-gray-500">Sipariş bulunamadı.</p>;
  }

  const breadcrumbItems = [
    { label: "Hesabım", href: "/account" },
    { label: "Siparişlerim", href: "/account/orders" },
    { label: "Sipariş Detayı" },
  ];

  // Sipariş Durumu Rozeti
  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; class: string }> = {
      PAID: { label: "Ödendi / Hazırlanıyor", class: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
      PENDING: { label: "Ödeme Bekleniyor", class: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
      FULFILLED: { label: "Tamamlandı", class: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" },
      CANCELLED: { label: "İptal Edildi", class: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
    };
    const current = map[status] || { label: status, class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" };
    return <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${current.class}`}>{current.label}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb ve Geri Dön */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Breadcrumb items={breadcrumbItems} />
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
        >
          <FiArrowLeft size={14} /> Siparişlerime Dön
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Sipariş Detayı: <span className="text-pink-600">#{order.orderNo}</span>
      </h1>

      {/* Sipariş Temel Bilgisi */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Sipariş No</span>
          <p className="font-bold text-gray-900 dark:text-white text-base mt-0.5">#{order.orderNo}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <FiClock size={13} /> {new Date(order.createdAt).toLocaleString("tr-TR")}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-1">Durum</span>
          {getStatusBadge(order.status)}
        </div>
      </section>

      {/* Teslimat Adresi */}
      {order.address && (
        <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <FiMapPin className="text-pink-600" /> Teslimat Adresi
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 pt-1">
            <p className="font-semibold text-gray-900 dark:text-white">{order.address.fullName}</p>
            <p>Tel: {order.address.phone}</p>
            <p>{order.address.address1}</p>
            <p>{order.address.district} / {order.address.city} {order.address.zip ? `- ${order.address.zip}` : ""}</p>
          </div>
        </section>
      )}

      {/* Ürünler Listesi */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <FiPackage className="text-pink-600" /> Sipariş Edilen Ürünler
        </h2>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {order.items.map((item: any) => {
            const productImage = item.product?.images?.[0]?.url;
            return (
              <li
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {productImage ? (
                    <Link href={`/product/${item.product.slug}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm">
                      <Image
                        src={productImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                      <FiPackage size={20} />
                    </div>
                  )}
                  <div>
                    <Link href={`/product/${item.product.slug}`} className="font-semibold text-gray-900 dark:text-white hover:text-pink-600 transition-colors">
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        SKU: {item.variant.sku}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Adet: <strong className="text-gray-700 dark:text-gray-200">{item.qty}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                  <span className="text-xs text-gray-400 sm:hidden">Toplam:</span>
                  <div>
                    <p className="text-xs text-gray-400">
                      {Number(item.unitPrice).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} / adet
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white text-base">
                      {(Number(item.unitPrice) * item.qty).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Ödeme ve Kargo Bilgileri Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {order.payment && (
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiCreditCard className="text-pink-600" /> Ödeme Bilgisi
            </h2>
            <div className="text-sm space-y-1.5 pt-1">
              <p className="flex justify-between">
                <span className="text-gray-500">Durum:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {order.payment.status === "SUCCEEDED" ? "Başarılı Ödeme" : order.payment.status}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">İşlem Kodu (Tx ID):</span>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{order.payment.txId || "-"}</span>
              </p>
            </div>
          </section>
        )}

        {order.shipment && (
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiTruck className="text-pink-600" /> Kargo Bilgisi
            </h2>
            <div className="text-sm space-y-1.5 pt-1">
              <p className="flex justify-between">
                <span className="text-gray-500">Kargo Firması:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{order.shipment.provider}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Takip Numarası:</span>
                <span className="font-mono font-medium text-pink-600 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded">{order.shipment.trackingNo}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Gönderi Durumu:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {order.shipment.status === "SHIPPED" ? "Kargoya Verildi" : order.shipment.status === "DELIVERED" ? "Teslim Edildi" : "İşleniyor"}
                </span>
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}