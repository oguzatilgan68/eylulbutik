"use client";

import React from "react";

interface PaginationProps {
  page: number;
  totalPages?: number; // opsiyonel
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      {/* Önceki */}
      <button
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Önceki
      </button>

      {/* Sayfa numarası */}
      <span className="text-gray-700 dark:text-gray-200 font-medium">
        Sayfa {page}
        {totalPages ? ` / ${totalPages}` : ""}
      </span>

      {/* Sonraki */}
      <button
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        disabled={totalPages ? page >= totalPages : false}
        onClick={() => onPageChange(page + 1)}
      >
        Sonraki
      </button>
    </div>
  );
};

export default Pagination;
