"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../../components/ui/LogoutButton";

const NAV_ITEMS = [
  { href: "/account", label: "Kullanıcı Bilgilerim" },
  { href: "/account/wishlist", label: "Favorilerim" },
  { href: "/account/orders", label: "Siparişlerim" },
  { href: "/account/myreviews", label: "Yorumlarım" },
  { href: "/account/returns", label: "İadelerim" },
  { href: "/account/addresses", label: "Adreslerim" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hesabım</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sol Menü */}
          <nav className="md:w-1/4 flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded transition-colors ${
                    isActive
                      ? "text-pink-500 border-b-2 border-pink-500 font-medium"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <LogoutButton />
          </nav>

          {/* Sağ İçerik */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
