"use client";

import { useEffect, useState } from "react";
import ReturnsList from "./returnDetailModal";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";

interface ReturnItem {
  id: string;
  createdAt: string;
  items: {
    id: string;
    qty: number;
    orderItem: {
      id: string;
      unitPrice: number;
      product: {
        id: string;
        name: string;
      };
      variant?: {
        id: string;
        sku: string;
      };
    };
  }[];
  order?: any;
  user?: any;
  refunds?: any[];
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // yeni state

  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "İade Talepleri", href: "/account/returns" },
  ];

  const fetchReturns = async (pageNumber: number) => {
    try {
      const res = await fetch(`/api/returns?page=${pageNumber}`);
      if (!res.ok) throw new Error("İade talepleri yüklenemedi");
      const data = await res.json();

      // API'nın döndürdüğü varsayımsal yapı
      // { items: ReturnItem[], totalPages: number }
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
    <div className="p-6 max-w-3xl mx-auto">
      <Breadcrumb items={breadcrumbs} />

      {returns.length === 0 ? (
        <div className="py-16 text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <p className="text-lg font-medium">İade talebiniz bulunmamaktadır.</p>
        </div>
      ) : (
        <>
          <ReturnsList returns={returns} />
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
