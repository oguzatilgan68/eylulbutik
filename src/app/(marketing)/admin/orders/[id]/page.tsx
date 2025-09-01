import { db } from "@/app/(marketing)/lib/db";
import React from "react";

interface OrderPageProps {
  params: { id: string };
}

const AdminOrderDetailPage = async ({ params }: OrderPageProps) => {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: { include: { product: true, variant: true } },
      payment: true,
      shipment: true,
    },
  });

  if (!order)
    return (
      <p className="text-red-500 dark:text-red-400">Sipariş bulunamadı.</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Sipariş Detayı: {order.orderNo}
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          Müşteri Bilgileri
        </h2>
        <p className="dark:text-gray-200">
          {order.user?.fullName || order.email}
        </p>
        <p className="dark:text-gray-200">{order.email}</p>
        <p className="dark:text-gray-200">{order.phone}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          Sipariş Ürünleri
        </h2>
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-2 text-left">Ürün</th>
              <th className="p-2 text-left">Varyant</th>
              <th className="p-2 text-left">Adet</th>
              <th className="p-2 text-left">Birim Fiyat</th>
              <th className="p-2 text-left">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-2 text-sm dark:text-white">
                  {item.product.name}
                </td>
                <td className="p-2 text-sm dark:text-white">
                  {item.variant ? JSON.stringify(item.variant.attributes) : "-"}
                </td>
                <td className="p-2 text-sm dark:text-white">{item.qty}</td>
                <td className="p-2 text-sm dark:text-white">
                  {item.unitPrice.toFixed(2)} ₺
                </td>
                <td className="p-2 text-sm dark:text-white">
                  {(Number(item.unitPrice) * Number(item.qty)).toFixed(2)} ₺
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          Ödeme ve Kargo
        </h2>
        <p className="dark:text-gray-200">
          Ödeme Durumu: {order.payment?.status || "Bekleniyor"}
        </p>
        <p className="dark:text-gray-200">
          Kargo Durumu: {order.shipment?.status || "Bekleniyor"}
        </p>
        <p className="dark:text-gray-200">
          Toplam Tutar: {order.total.toFixed(2)} ₺
        </p>
      </section>
    </div>
  );
};

export default AdminOrderDetailPage;
