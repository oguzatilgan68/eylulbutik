"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/brands", label: "Markalar" },
  { href: "/admin/product-properties", label: "Ürün Özellik Değerler" },
  { href: "/admin/global-properties", label: "Ürün Özellikleri" },
  { href: "/admin/attribute-types", label: "Varyasyonlar" },
  { href: "/admin/orders", label: "Siparişler" },
  { href: "/admin/shipment", label: "Kargo Gönderim" },
  { href: "/admin/coupons", label: "Kuponlar" },
  { href: "/admin/model-info", label: "Model Bilgileri" },
  { href: "/admin/returns", label: "İadeler" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-56 sm:w-64 bg-white dark:bg-gray-800 p-6 flex flex-col">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <AdminNavLink key={link.href} href={link.href}>
              {link.label}
            </AdminNavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}

/* --- Helper Component --- */
function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "px-4 py-2 rounded-md transition-colors",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        isActive && "bg-gray-200 dark:bg-gray-700 font-medium"
      )}
    >
      {children}
    </Link>
  );
}
