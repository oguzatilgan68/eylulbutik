import { cookies } from "next/headers";
import { ShipmentSection } from "./ShipmentSection";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

// ✅ Yardımcı fonksiyonlar

const AdminOrderDetailPage = async (props: OrderPageProps) => {
  const params = await props.params;
  const cookieStore = await cookies(); // tüm cookie'leri al
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/orders/${params.id}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );
  const formatCurrency = (amount?: number | string) => {
    if (!amount) return "0.00 ₺";
    return `${Number(amount).toFixed(2)} ₺`;
  };
  const textClass = "dark:text-gray-200";
  if (!res.ok) {
    return (
      <p className="text-red-500 dark:text-red-400">
        Sipariş bulunamadı veya hata oluştu.
      </p>
    );
  }

  const { order, address } = await res.json();

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
        <p className={textClass}>{order.user?.fullName || order.user?.phone}</p>
        <p className={textClass}>{order.user?.email}</p>
        <p className={textClass}>{order.phone}</p>

        {address && (
          <div className="mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold dark:text-white">Adres</h3>
            <p className={textClass}>{address.fullName}</p>
            <p className={textClass}>{address.phone}</p>
            <p className={textClass}>
              {address.city} {address.district} {address.neighbourhood} Mah.{" "}
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
            {order.items.map((item: any) => {
              const variantText = item.variant
                ? item.variant.attributes
                    .map(
                      (attr: any) =>
                        `${attr.value.type.name}: ${attr.value.value}`
                    )
                    .join(", ")
                : "Yok";

              return (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className={`p-2 text-sm dark:text-white`}>
                    {item.product.name}
                  </td>
                  <td className={`p-2 text-sm dark:text-white`}>
                    {variantText}
                  </td>
                  <td className={`p-2 text-sm dark:text-white`}>{item.qty}</td>
                  <td className={`p-2 text-sm dark:text-white`}>
                    {formatCurrency(Number(item.unitPrice))}
                  </td>
                  <td className={`p-2 text-sm dark:text-white`}>
                    {formatCurrency(Number(item.unitPrice) * Number(item.qty))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* ---------------- Ödeme ---------------- */}
      <section>
        <h2 className="text-xl font-semibold dark:text-white">
          Ödeme Bilgileri
        </h2>
        <p className={textClass}>
          Ödeme Durumu:{" "}
          {order.payment?.status === "SUCCEEDED" ? "Başarılı" : "Başarısız"}
        </p>
        <p className={textClass}>Toplam: {formatCurrency(order.total)}</p>
      </section>

      {/* ---------------- Kargo ---------------- */}
      <ShipmentSection orderId={order.id} shipment={order.shipment} />
    </div>
  );
};

export default AdminOrderDetailPage;
