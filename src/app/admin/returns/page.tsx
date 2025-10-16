"use client";

import ReturnDetailsModal from "@/app/(marketing)/components/admin/returns/ReturnDetailsModal";
import ReturnsCards from "@/app/(marketing)/components/admin/returns/ReturnsCards";
import ReturnsTable from "@/app/(marketing)/components/admin/returns/ReturnsTable";
import { ReturnRequestWithRelations } from "@/app/(marketing)/components/admin/returns/types";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import { useEffect, useState } from "react";

export default function ReturnsPage() {
  const [list, setList] = useState<ReturnRequestWithRelations[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;
  const [selected, setSelected] = useState<ReturnRequestWithRelations | null>(
    null
  );

  const fetchReturns = async (pageNum = 1) => {
    const res = await fetch(
      `/api/admin/returns?page=${pageNum}&perPage=${perPage}`
    );
    const json = await res.json();
    setList(json.data);
    setTotal(json.meta.total);
  };

  useEffect(() => {
    fetchReturns(page);
  }, [page]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/returns", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    fetchReturns(page);
  };

  return (
    <div className="p-4">
      {/* Mobile Cards */}
      <ReturnsCards
        list={list}
        onSelect={(r) => setSelected(r)}
        onUpdate={updateStatus}
      />{" "}
      {/* Desktop Table */}
      <ReturnsTable
        list={list}
        onSelect={(r) => setSelected(r)}
        onUpdate={updateStatus}
      />{" "}
      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={Math.ceil(total / perPage)}
        onPageChange={(p) => setPage(p)}
      />
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
