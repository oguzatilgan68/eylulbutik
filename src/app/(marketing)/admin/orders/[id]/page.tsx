import { db } from "@/app/(marketing)/lib/db";
import { ShipmentSection } from "./ShipmentSection";

// ✅ Server Component + Client Wrapper ayırıyoruz
interface OrderPageProps {
  params: Promise<{ id: string }>;
}

const AdminOrderDetailPage = async (props: OrderPageProps) => {
  const params = await props.params;
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
          variant: {
            include: {
              attributes: {
                include: { value: true },
              },
            },
          },
        },
      },
      payment: true,
      shipment: true, // mevcut shipment
    },
  });

  const address = order?.addressId
    ? await db.address.findUnique({ where: { id: order.addressId } })
    : null;
  if (!order)
    return (
      <p className="text-red-500 dark:text-red-400">Sipariş bulunamadı.</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold dark:text-white">
        Sipariş Detayı: {order.orderNo}
      </h1>

      {/* ---------------- Müşteri ---------------- */}
      <section>
        <h2 className="text-xl font-semibold dark:text-white">
          Müşteri Bilgileri
        </h2>
        <p className="dark:text-gray-200">
          {order.user?.fullName || order.email}
        </p>
        <p className="dark:text-gray-200">{order.email}</p>
        <p className="dark:text-gray-200">{order.phone}</p>
        {address && (
          <div className="mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold dark:text-white">Adres</h3>
            <p className="dark:text-gray-200">{address.fullName}</p>
            <p className="dark:text-gray-200">{address.phone}</p>
            <p className="dark:text-gray-200">
              {address.city} {address.district} {address.neighbourhood + " "}
              Mah.
              {address.address1}
            </p>
          </div>
        )}
      </section>
      {/* ---------------- Ürünler ---------------- */}
      <section>
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
                  {item.variant
                    ? item.variant.attributes
                        .map((attr) => `${attr.value.value}`)
                        .join(", ")
                    : "Yok"}
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

      {/* ---------------- Ödeme ---------------- */}
      <section>
        <h2 className="text-xl font-semibold dark:text-white">
          Ödeme Bilgileri
        </h2>
        <p className="dark:text-gray-200">
          Ödeme Durumu:{" "}
          {order.payment?.status === "SUCCEEDED" ? "Başarılı" : "Başarısız"}
        </p>
        <p className="dark:text-gray-200">Toplam: {order.total.toFixed(2)} ₺</p>
      </section>

      {/* ---------------- Kargo ---------------- */}
      <ShipmentSection orderId={order.id} shipment={order.shipment} />
    </div>
  );
};

export default AdminOrderDetailPage;
