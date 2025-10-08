import React from "react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";

export function ShipmentPagination({ page, setPage, total, perPage }: any) {
  return (
    <footer className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-slate-500">Toplam: {total}</div>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / perPage)}
        onPageChange={setPage}
      />
    </footer>
  );
}
