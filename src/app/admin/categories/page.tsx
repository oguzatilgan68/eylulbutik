"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";

interface Category {
  id: string;
  name: string;
  parentName?: string;
  imageUrl?: string;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/categories?page=${page}&limit=${pageSize}`
      );
      if (!res.ok) throw new Error("Kategoriler alınamadı");
      const data = await res.json();
      setCategories(data.categories || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğine emin misin?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız");
      fetchCategories(page);
    } catch (err) {
      console.error(err);
      alert("Kategori silinemedi.");
    }
  };

  const renderCategory = (category: Category, level = 0) => (
    <React.Fragment key={category.id}>
      <tr className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900 transition-colors">
        {/* Kategori sütunu */}
        <td
          className="px-4 py-2"
          style={{ paddingLeft: `${level * 20 + 16}px` }}
        >
          <div className="flex items-center gap-3">
            {category.imageUrl && (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium">{category.name}</span>
              {category.parentName && (
                <span className="text-gray-500 text-xs">
                  Üst Kategori: {category.parentName}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* İşlemler sütunu */}
        <td className="px-4 py-2 flex gap-2 justify-start">
          <Link
            href={`/admin/categories/${category.id}`}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Düzenle
          </Link>
          <button
            onClick={() => handleDelete(category.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sil
          </button>
        </td>
      </tr>

      {/* Alt kategoriler */}
      {category.children?.map((child) => renderCategory(child, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm border-collapse bg-white dark:bg-gray-800 min-w-[600px]">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-center">
                  Yükleniyor...
                </td>
              </tr>
            ) : categories?.length > 0 ? (
              categories.map((cat) => renderCategory(cat))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-2 text-center text-gray-500 dark:text-gray-400"
                >
                  Henüz kategori eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
