"use client";

import ReturnDetailsModal from "@/app/(marketing)/components/admin/returns/ReturnDetailsModal";
import ReturnsCards from "@/app/(marketing)/components/admin/returns/ReturnsCards";
import ReturnsTable from "@/app/(marketing)/components/admin/returns/ReturnsTable";
import { ReturnRequestWithRelations } from "@/app/(marketing)/components/admin/returns/types";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import { useEffect, useState } from "react";
import { FiRotateCcw } from "react-icons/fi";

export default function ReturnsPage() {
  const [list, setList] = useState<ReturnRequestWithRelations[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;
  const [selected, setSelected] = useState<ReturnRequestWithRelations | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchReturns = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/returns?page=${pageNum}&perPage=${perPage}`
      );
      const json = await res.json();
      setList(json.data || []);
      setTotal(json.meta?.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns(page);
  }, [page]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/returns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchReturns(page);
    } catch (error) {
      console.error(error);
      alert("Durum güncellenemedi.");
    }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiRotateCcw className="text-pink-600" /> İade Talepleri Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Müşteriler tarafından oluşturulan ürün iade ve değişim taleplerini buradan inceleyin.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
            <span>İade talepleri yükleniyor...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden">
            <ReturnsCards
              list={list}
              onSelect={(r) => setSelected(r)}
              onUpdate={updateStatus}
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <ReturnsTable
              list={list}
              onSelect={(r) => setSelected(r)}
              onUpdate={updateStatus}
            />
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {selected && (
        <ReturnDetailsModal
          returnRequest={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateStatus}
        />
      )}
    </div>
  );
}