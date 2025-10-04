"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import Image from "next/image";
import Link from "next/link";

interface OrderDetailPageProps {
  id: string;
}

export default async function OrderDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;
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

  if (loading) return <p className="p-4">Yükleniyor...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!order) return <p className="p-4 text-gray-700">Sipariş bulunamadı.</p>;

  const breadcrumbItems = [
    { label: "Hesabım", href: "/account" },
    { label: "Siparişlerim", href: "/account/orders" },
    { label: "Sipariş Detayı" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Sipariş Detayı
      </h1>

      {/* Sipariş Bilgisi */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sipariş No
            </p>
            <p className="font-semibold">{order.orderNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Durum</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {new Date(order.createdAt).toLocaleString("tr-TR")}
        </p>
      </section>

      {/* Adres Bilgisi */}
      {order.address && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Teslimat Adresi</h2>
          <p className="text-sm">{order.address.fullName}</p>
          <p className="text-sm">{order.address.phone}</p>
          <p className="text-sm">{order.address.address1}</p>
          <p className="text-sm">
            {order.address.city} / {order.address.district}
          </p>
          <p className="text-sm">{order.address.zip}</p>
        </section>
      )}

      {/* Ürünler */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Ürünler</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {order.items.map((item: any) => {
            const productImage = item.product?.images?.[0]?.url;
            return (
              <li
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {productImage && (
                    <Link href={`/product/${item.product.slug}`}>
                      <Image
                        src={productImage}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    </Link>
                  )}
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.variant.sku}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adet: {item.qty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p>
                    {Number(item.unitPrice).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </p>
                  <p className="font-semibold">
                    {(Number(item.unitPrice) * item.qty).toLocaleString(
                      "tr-TR",
                      {
                        style: "currency",
                        currency: "TRY",
                      }
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Ödeme ve Kargo */}
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        {order.payment && (
          <section className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Ödeme Bilgisi</h2>
            <p className="text-sm">
              Durum:{" "}
              {order.payment.status === "CANCELED"
                ? "İptal Edildi"
                : order.payment.status === "PENDING"
                ? "Beklemede"
                : order.payment.status === "SUCCEEDED"
                ? "Başarılı"
                : "Başarısız"}
            </p>
            <p className="text-sm">Tx ID: {order.payment.txId}</p>
          </section>
        )}

        {order.shipment && (
          <section className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Kargo Bilgisi</h2>
            <p className="text-sm">Kargo Firması: {order.shipment.provider}</p>
            <p className="text-sm">Takip No: {order.shipment.trackingNo}</p>
            <p className="text-sm">
              Durum:{" "}
              {order.shipment.status === "PROCESSING"
                ? "İşleniyor"
                : order.shipment.status === "SHIPPED"
                ? "Kargoya Verildi"
                : order.shipment.status === "DELIVERED"
                ? "Teslim Edildi"
                : "Bilinmiyor"}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
