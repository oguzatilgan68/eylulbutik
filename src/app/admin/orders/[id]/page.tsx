import { cookies } from "next/headers";
import { ShipmentSection } from "./ShipmentSection";
import Link from "next/link";
import { FiArrowLeft, FiUser, FiMapPin, FiPackage, FiCreditCard } from "react-icons/fi";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

const AdminOrderDetailPage = async (props: OrderPageProps) => {
  const params = await props.params;
  const cookieStore = await cookies();
  
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

  if (!res.ok) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-rose-500 font-semibold mb-4">Sipariş bulunamadı veya hata oluştu.</p>
        <Link href="/admin/orders" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium">
          ← Siparişlere Geri Dön
        </Link>
      </div>
    );
  }

  const { order, address } = await res.json();
  const textClass = "text-gray-600 dark:text-gray-300 text-sm";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Üst Başlık & Geri Dön */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Sipariş Detayı: <span className="text-pink-600">#{order.orderNo}</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Sipariş Tarihi: {new Date(order.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Müşteri & Adres Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Müşteri Bilgileri */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <FiUser className="text-pink-600" /> Müşteri Bilgileri
          </h2>
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {order.user?.fullName || order.user?.phone || "İsim Belirtilmemiş"}
          </p>
          <p className={textClass}>E-posta: {order.user?.email || "-"}</p>
          <p className={textClass}>Telefon: {order.phone || "-"}</p>
        </div>

        {/* Teslimat Adresi */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <FiMapPin className="text-pink-600" /> Teslimat Adresi
          </h2>
          {address ? (
            <div className="space-y-1">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{address.fullName}</p>
              <p className={textClass}>Tel: {address.phone}</p>
              <p className={textClass}>
                {address.neighbourhood ? `${address.neighbourhood} Mah. ` : ""}
                {address.address1}, {address.district} / {address.city}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Adres bilgisi bulunamadı.</p>
          )}
        </div>
      </div>

      {/* Sipariş Ürünleri Tablosu */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden space-y-4 p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <FiPackage className="text-pink-600" /> Sipariş Edilen Ürünler
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3">Ürün</th>
                <th className="px-4 py-3">Varyant</th>
                <th className="px-4 py-3">Adet</th>
                <th className="px-4 py-3">Birim Fiyat</th>
                <th className="px-4 py-3 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {order.items.map((item: any) => {
                const variantText = item.variant
                  ? item.variant.attributes
                      .map((attr: any) => `${attr.value.type.name}: ${attr.value.value}`)
                      .join(", ")
                  : "Standart";

                return (
                  <tr key={item.id} className="hover:bg-pink-50/20 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {variantText}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                      {item.qty}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {formatCurrency(Number(item.unitPrice))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                      {formatCurrency(Number(item.unitPrice) * Number(item.qty))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Ödeme Özeti & Kargo Yönetimi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ödeme Bilgileri */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <FiCreditCard className="text-pink-600" /> Ödeme Özeti
          </h2>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Ödeme Durumu:</span>
            <span className={`font-semibold px-2.5 py-0.5 rounded-full text-xs ${
              order.payment?.status === "SUCCEEDED" 
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" 
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
            }`}>
              {order.payment?.status === "SUCCEEDED" ? "Başarılı Ödeme" : "Bekliyor / Başarısız"}
            </span>
          </div>
          <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-gray-800 dark:text-gray-200">Genel Toplam:</span>
            <span className="text-pink-600 text-lg">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Kargo Bölümü Kartı */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <ShipmentSection orderId={order.id} shipment={order.shipment} />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;