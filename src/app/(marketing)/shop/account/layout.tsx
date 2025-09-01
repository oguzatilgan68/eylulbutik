import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Hesabım",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hesabım</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <nav className="md:w-1/4 flex flex-col space-y-2">
            <Link
              href="/account/orders"
              className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Siparişlerim
            </Link>
            <Link
              href="/account/wishlist"
              className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Favorilerim
            </Link>
            <Link
              href="/account/addresses"
              className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Adreslerim
            </Link>
          </nav>
          <div className="md:flex-1 bg-white dark:bg-gray-800 p-6 rounded shadow">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
