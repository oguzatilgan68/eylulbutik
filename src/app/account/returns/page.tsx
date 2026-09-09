"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { FiRotateCcw, FiPackage } from "react-icons/fi";

interface ReturnItem {
  id: string;
  status: string;
  comment?: string;
  createdAt: string;
  order?: { orderNo: string };
  items: {
    id: string;
    qty: number;
    reason: string;
    orderItem: {
      name: string;
      unitPrice: number;
      variant?: { name?: string };
      product: {
        name: string;
        images: { url: string; alt?: string }[];
      };
    };
  }[];
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "İade Talepleri", href: "/account/returns" },
  ];

  const fetchReturns = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/returns?page=${pageNumber}`);
      if (!res.ok) throw new Error("İade talepleri yüklenemedi");
      const data = await res.json();
      setReturns(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns(page);
  }, [page]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; class: string }> = {
      PENDING: { label: "Onay Bekliyor", class: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
      APPROVED: { label: "Onaylandı", class: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
      REJECTED: { label: "Reddedildi", class: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
    };
    const current = map[status] || { label: status, class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" };
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${current.class}`}>{current.label}</span>;
  };

  if (error)
    return <p className="p-6 text-center text-rose-500 font-medium">Hata: {error}</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbs} />

      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiRotateCcw className="text-pink-600" /> İade ve Değişim Taleplerim
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Oluşturduğunuz iade taleplerinin durumunu buradan takip edebilirsiniz.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : returns.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-2">
            <FiPackage size={22} />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            Henüz bir iade talebiniz bulunmamaktadır.
          </p>
          <p className="text-xs text-gray-500">
            Sipariş detaylarınızdan kolayca iade talebi oluşturabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-4">
            {returns.map((r) => {
              const orderNo = r.order?.orderNo || "—";
              const date = new Date(r.createdAt).toLocaleDateString("tr-TR");
              const totalQty = r.items.reduce((sum, i) => sum + i.qty, 0);
              const totalPrice = r.items.reduce(
                (sum, i) => sum + i.orderItem.unitPrice * i.qty,
                0
              );
              const isOpen = openDropdown === r.id;

              return (
                <li
                  key={r.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden transition-all hover:border-pink-500/30"
                >
                  {/* Başlık / Akordeon Tetikleyici */}
                  <div
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setOpenDropdown(isOpen ? null : r.id)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          Sipariş #{orderNo}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span className="text-xs text-gray-400">{date}</span>
                      </div>
                      <div>{getStatusBadge(r.status)}</div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {totalQty} Ürün
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                          ₺{totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-gray-800 text-gray-500 shadow-sm">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Açılır Ürün Listesi */}
                  {isOpen && (
                    <div className="p-6 space-y-4 border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                      {r.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`flex items-start gap-4 ${idx > 0 ? "pt-4" : ""}`}
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <Image
                              src={
                                item.orderItem.product.images?.[0]?.url ||
                                "/placeholder.webp"
                              }
                              alt={
                                item.orderItem.product.images?.[0]?.alt ||
                                "Ürün görseli"
                              }
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-1">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                              {item.orderItem.product.name}
                            </h3>

                            {item.orderItem.variant?.name && (
                              <p className="text-xs text-gray-500">
                                Varyant: {item.orderItem.variant.name}
                              </p>
                            )}

                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              İade Nedeni:{" "}
                              <strong className="text-gray-800 dark:text-gray-200">
                                {item.reason === "PRODUCT_DEFECT"
                                  ? "Defolu Ürün"
                                  : item.reason === "WRONG_ITEM_SENT"
                                    ? "Yanlış Ürün Gönderildi"
                                    : item.reason === "SHIPPING_DELAY"
                                      ? "Gönderim Gecikmesi"
                                      : item.reason === "CUSTOMER_REQUEST"
                                        ? "Müşteri Talebi"
                                        : "Diğer"}
                              </strong>
                            </p>

                            <div className="flex items-center justify-between text-xs pt-1">
                              <span className="text-gray-500">Adet: {item.qty}</span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                ₺{(item.orderItem.unitPrice * item.qty).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}