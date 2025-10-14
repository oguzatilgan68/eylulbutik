"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";

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

  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "İade Talepleri", href: "/account/returns" },
  ];

  const fetchReturns = async (pageNumber: number) => {
    try {
      const res = await fetch(`/api/returns?page=${pageNumber}`);
      if (!res.ok) throw new Error("İade talepleri yüklenemedi");
      const data = await res.json();
      setReturns(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    }
  };

  useEffect(() => {
    fetchReturns(page);
  }, [page]);

  if (error)
    return <p className="p-6 text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbs} />
      <h1 className="text-2xl font-semibold mb-6 dark:text-white">
        İade Taleplerim
      </h1>

      {returns.length === 0 ? (
        <div className="py-20 text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <p className="text-lg font-medium">
            Henüz bir iade talebiniz bulunmamaktadır.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-5">
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
                  className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
                >
                  {/* Başlık */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setOpenDropdown(isOpen ? null : r.id)}
                  >
                    <div>
                      <p className="text-sm text-gray-500">
                        Sipariş No:{" "}
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {orderNo}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Tarih:{" "}
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {date}
                        </span>
                      </p>
                      <p
                        className={`text-sm mt-2 font-medium ${
                          r.status === "APPROVED"
                            ? "text-green-600"
                            : r.status === "REJECTED"
                              ? "text-red-500"
                              : "text-yellow-500"
                        }`}
                      >
                        {r.status === "PENDING"
                          ? "Beklemede"
                          : r.status === "APPROVED"
                            ? "Onaylandı"
                            : r.status === "REJECTED"
                              ? "Reddedildi"
                              : r.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Toplam Ürün:{" "}
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {totalQty}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Toplam:{" "}
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            ₺{totalPrice.toFixed(2)}
                          </span>
                        </p>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Açılır Ürün Listesi */}
                  {isOpen && (
                    <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                      {r.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
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

                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {item.orderItem.product.name}
                            </h3>

                            {item.orderItem.variant?.name && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                Varyant: {item.orderItem.variant.name}
                              </p>
                            )}

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              İade Nedeni:{" "}
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {item.reason === "PRODUCT_DEFECT"
                                  ? "Defolu Ürün"
                                  : item.reason === "WRONG_ITEM_SENT"
                                    ? "Yanlış Ürün Gönderildi"
                                    : item.reason === "SHIPPING_DELAY"
                                      ? "Gönderim Gecikmesi"
                                      : item.reason === "CUSTOMER_REQUEST"
                                        ? "Müşteri Talebi"
                                        : "Diğer"}
                              </span>
                            </p>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Adet:{" "}
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {item.qty}
                              </span>
                            </p>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Tutar:{" "}
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                ₺{item.orderItem.unitPrice.toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Genel Bilgiler */}
                      <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Genel Bilgiler
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Toplam Ürün Adedi:{" "}
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {totalQty}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Toplam Tutar:{" "}
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            ₺{totalPrice.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
