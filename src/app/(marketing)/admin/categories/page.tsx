import Link from "next/link";
import { db } from "@/app/(marketing)/lib/db";
import React from "react";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  const renderCategory = (category: any, level = 0) => (
    <React.Fragment key={category.id}>
      <tr
        key={category.id}
        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        <td
          className="px-4 py-2 pl-4"
          style={{ paddingLeft: `${level * 20 + 16}px` }}
        >
          {category.name}
        </td>
        <td className="px-4 py-2">
          <Link
            href={`/admin/categories/${category.id}`}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Düzenle
          </Link>
        </td>
      </tr>
      {category.children.map((child: any) => renderCategory(child, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Kategoriler</h2>
        <Link
          href="/admin/categories/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Yeni Kategori
        </Link>
      </div>

      <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded shadow">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Kategori Adı</th>
            <th className="px-4 py-2 text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>{categories.map((category) => renderCategory(category))}</tbody>
      </table>
    </div>
  );
}
