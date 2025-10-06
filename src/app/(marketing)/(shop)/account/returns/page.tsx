"use client";

import { useEffect, useState } from "react";
import ReturnsList from "./returnDetailModal";
import Pagination from "@/app/(marketing)/components/ui/Pagination";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchReturns = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/returns?page=${pageNumber}`);
      if (!res.ok) throw new Error("İade talepleri yüklenemedi");
      const data = await res.json();
      setReturns(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns(page);
  }, [page]);

  if (loading) return <p className="p-4">Yükleniyor...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ReturnsList returns={returns} />
      {returns.length > 0 && (
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
      )}
    </div>
  );
}
