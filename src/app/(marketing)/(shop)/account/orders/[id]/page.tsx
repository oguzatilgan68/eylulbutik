import { db } from "@/app/(marketing)/lib/db";
import { notFound } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";
import Link from "next/link";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      payment: true,
      shipment: true,
    },
  });
  const breadcrumbItems = [
    { label: "Hesabım", href: "/account" },
    { label: "Siparişlerim", href: "/account/orders" },
    { label: "Sipariş Detayı" }, // aktif sayfa href'siz olur
  ];
  if (!order) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb: siparişlerim */}
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Sipariş Detayı
      </h1>
      {/* Sipariş Başlığı */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
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
              {order.status === "PAID"
                ? "Ödendi"
                : order.status === "PENDING"
                ? "Beklemede"
                : "İptal Edildi"}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {new Date(order.createdAt).toLocaleString("tr-TR")}
        </p>
      </div>

      {/* Ürünler */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Ürünler</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                {item.variant && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.variant.name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p>
                  {item.qty} ×{" "}
                  {Number(item.unitPrice).toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </p>
                <p className="font-semibold">
                  {(Number(item.unitPrice) * item.qty).toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Ödeme Özeti */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Ödeme Özeti</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Ara Toplam</span>
            <span>
              {Number(order.subtotal).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>İndirim</span>
            <span className="text-red-500">
              -{" "}
              {Number(order.discountTotal).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Kargo</span>
            <span>
              {Number(order.shippingTotal).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Vergi</span>
            <span>
              {Number(order.taxTotal).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 pt-2 flex justify-between font-semibold">
            <span>Toplam</span>
            <span>
              {Number(order.total).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Ödeme Bilgisi */}
      {order.payment && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Ödeme Bilgisi</h2>
          <p className="text-sm">Sağlayıcı: {order.payment.provider}</p>
          <p className="text-sm">Durum: {order.payment.status}</p>
          <p className="text-sm">Tx ID: {order.payment.txId}</p>
        </div>
      )}

      {/* Kargo Bilgisi */}
      {order.shipment && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
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
        </div>
      )}
    </div>
  );
}
