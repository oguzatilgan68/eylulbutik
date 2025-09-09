import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Ürünler
          </Link>
          <Link
            href="/admin/brands"
            className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Markalar
          </Link>
          <Link
            href="/admin/attribute-types"
            className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Ürün Özellikleri
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Siparişler
          </Link>
          <Link
            href="/admin/categories"
            className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Kategoriler
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
