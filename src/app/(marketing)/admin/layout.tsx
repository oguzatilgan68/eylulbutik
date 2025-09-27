"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks: Array<{
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}> = [
  {
    href: "/admin/products",
    label: "Ürünler",
    children: [
      { href: "/admin/products", label: "Ürünler" },
      { href: "/admin/products/new", label: "Yeni Ürün" },
      { href: "/admin/global-properties", label: "Ürün Özellikleri" },
      { href: "/admin/product-properties", label: "Ürün Özellik Değerler" },
      { href: "/admin/attribute-types", label: "Varyasyonlar" },
      { href: "/admin/coupons", label: "Kuponlar" },
      { href: "/admin/reviews", label: "Yorum Yönetimi" },
    ],
  },
  {
    href: "/admin/categories",
    label: "Kategoriler",
    children: [
      { href: "/admin/categories", label: "Kategoriler" },
      { href: "/admin/categories/new", label: "Yeni Kategori" },
    ],
  },
  {
    href: "/admin/brands",
    label: "Markalar",
    children: [
      { href: "/admin/brands", label: "Markalar" },
      { href: "/admin/brands/new", label: "Yeni Marka" },
    ],
  },
  {
    href: "/admin/orders",
    label: "Siparişler",
    children: [
      { href: "/admin/orders", label: "Tüm Siparişler" },
      { href: "/admin/shipment", label: "Kargo Gönderim" },
      { href: "/admin/returns", label: "İadeler" },
    ],
  },
  {
    href: "/admin/customers",
    label: "Müşteriler",
    children: [{ href: "/admin/customers", label: "Müşteriler" }],
  },
  {
    href: "/admin/model-info",
    label: "Model Bilgileri",
    children: [
      { href: "/admin/model-info", label: "Model Bilgileri" },
      { href: "/admin/model-info/new", label: "Yeni Model Bilgisi" },
    ],
  },
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
            <AdminNavLink key={link.href} link={link} />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}

/* --- Helper Component --- */
function AdminNavLink({ link }: { link: (typeof navLinks)[number] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (!pathname) return null;
  const isActive = pathname.startsWith(link.href);
  const hasChildren = link.children && link.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((prev) => !prev)}
        className={clsx(
          "w-full flex justify-between items-center px-4 py-2 rounded-md transition-colors",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          isActive && "bg-gray-200 dark:bg-gray-700 font-medium"
        )}
      >
        <span>{link.label}</span>
        {hasChildren && (
          <span
            className={clsx("ml-2 transition-transform", open && "rotate-90")}
          >
            ▶
          </span>
        )}
      </button>

      {hasChildren && open && (
        <div className="flex flex-col ml-4 mt-1 gap-1">
          {link.children!.map((child) => {
            const childActive = pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={clsx(
                  "px-4 py-2 rounded-md transition-colors",
                  "hover:bg-gray-200 dark:hover:bg-gray-700",
                  childActive && "bg-gray-200 dark:bg-gray-700 font-medium"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
