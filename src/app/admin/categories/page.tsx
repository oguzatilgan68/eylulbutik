"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import { FiPlus, FiEdit2, FiTrash2, FiFolder } from "react-icons/fi";

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
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
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
      <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors">
        {/* Kategori sütunu */}
        <td
          className="px-6 py-4"
          style={{ paddingLeft: `${level * 28 + 24}px` }}
        >
          <div className="flex items-center gap-3.5">
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-11 h-11 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700">
                <FiFolder size={20} />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {category.name}
              </span>
              {category.parentName && (
                <span className="text-gray-400 text-xs mt-0.5">
                  Üst Kategori: <strong className="text-gray-500 dark:text-gray-300">{category.parentName}</strong>
                </span>
              )}
            </div>
          </div>
        </td>

        {/* İşlemler sütunu */}
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/categories/${category.id}`}
              className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <FiEdit2 size={13} /> Düzenle
            </Link>
            <button
              onClick={() => handleDelete(category.id)}
              className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <FiTrash2 size={13} /> Sil
            </button>
          </div>
        </td>
      </tr>

      {/* Alt kategoriler */}
      {category.children?.map((child) => renderCategory(child, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yeni Ekle Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Kategori Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Mağazanızdaki ana ve alt kategorileri buradan yönetebilirsiniz.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium shadow-md shadow-pink-500/20 transition-all"
        >
          <FiPlus size={18} /> Yeni Kategori Ekle
        </Link>
      </div>

      {/* Tablo Alanı */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5">Kategori Adı</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      <span>Kategoriler yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : categories?.length > 0 ? (
                categories.map((cat) => renderCategory(cat))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Henüz kategori eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}