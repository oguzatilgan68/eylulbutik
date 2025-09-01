import React from "react";
import Link from "next/link";
import { db } from "@/app/(marketing)/lib/db";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ürünler</h2>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Yeni Ürün
        </Link>
      </div>

      <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded shadow">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Adı</th>
            <th className="px-4 py-2 text-left">Marka</th>
            <th className="px-4 py-2 text-left">Kategori</th>
            <th className="px-4 py-2 text-left">Fiyat</th>
            <th className="px-4 py-2 text-left">Durum</th>
            <th className="px-4 py-2 text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2 flex items-center gap-2">
                {product.images[0] && (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                {product.name}
              </td>
              <td className="px-4 py-2">{product.brand?.name || "-"}</td>
              <td className="px-4 py-2">{product.category.name}</td>
              <td className="px-4 py-2">
                {product.price.toFixed(2)} {product.currency}
              </td>
              <td className="px-4 py-2">{product.status}</td>
              <td className="px-4 py-2 flex gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Düzenle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
