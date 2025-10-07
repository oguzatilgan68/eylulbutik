"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "../../components/ui/Pagination";

interface Product {
  id: string;
  name: string;
  status: string;
  price: number | null;
  brand?: { name: string };
  category: { name: string };
  images: { url: string; alt?: string }[];
  variants: { price: number }[];
}

const statusMap: Record<string, string> = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşivlendi",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `/api/admin/products?page=${page}&pageSize=${pageSize}`
      );
      const data = await res.json();
      setProducts(data.items);
      setTotalPages(data.totalPages);
    };
    fetchProducts();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Ürünler</h2>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Yeni Ürün
        </Link>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full table-auto border-collapse text-sm sm:text-base">
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
            {products.length > 0 ? (
              products.map((product) => (
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
                    <span className="line-clamp-1">{product.name}</span>
                  </td>
                  <td className="px-4 py-2">{product.brand?.name || "-"}</td>
                  <td className="px-4 py-2">{product.category.name}</td>
                  <td className="px-4 py-2">
                    {product.variants?.[0]?.price
                      ? Number(product.variants[0].price).toFixed(2)
                      : Number(product.price).toFixed(2) || "-"}{" "}
                    TRY
                  </td>
                  <td className="px-4 py-2">
                    {statusMap[product.status] || product.status}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Henüz ürün bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={10} onPageChange={setPage} />
    </div>
  );
}
