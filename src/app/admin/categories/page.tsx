"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Kategoriler alınamadı");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderCategory = (category: Category, level = 0) => (
    <React.Fragment key={category.id}>
      <tr className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900 transition-colors">
        <td
          className="px-4 py-2"
          style={{ paddingLeft: `${level * 20 + 16}px` }}
        >
          {category.name}
        </td>
        <td className="px-4 py-2">
          <Link
            href={`/admin/categories/${category.id}`}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Düzenle
          </Link>
        </td>
      </tr>
      {category.children?.map((child) => renderCategory(child, level + 1))}
    </React.Fragment>
  );

  if (loading) return <p className="text-center mt-4">Yükleniyor...</p>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold dark:text-white">Kategoriler</h2>
        <Link
          href="/admin/categories/new"
          className="self-start sm:self-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          + Yeni Kategori
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm border-collapse bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2">Kategori Adı</th>
              <th className="px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
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
    </div>
  );
}
