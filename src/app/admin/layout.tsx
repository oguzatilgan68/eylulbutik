"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  {
    href: "/admin/products",
    label: "Ürünler",
    children: [
      { href: "/admin/products", label: "Ürünler" },
      { href: "/admin/products/new", label: "Yeni Ürün" },
      { href: "/admin/global-properties", label: "Ürün Özellikleri" },
      { href: "/admin/product-properties", label: "Ürün Özellik Değerleri" },
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobil Menü Butonu */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menüyü aç/kapat"
      >
        ☰{" "}
      </button>
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 p-6 z-40 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <h1 className="text-2xl font-bold m-6">Admin Panel</h1>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => (
            <AdminNavLink
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              key={link.href}
              link={link}
            />
          ))}
        </nav>
      </aside>
      {/* Overlay (mobilde sidebar açıkken arka plan karartma) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* İçerik */}
      <main className="flex-1 p-4 mt-10 sm:p-6 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}

/* --- Helper Component --- */
function AdminNavLink({
  link,
  isOpen,
  setIsOpen,
}: {
  link: (typeof navLinks)[number];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = pathname?.startsWith(link.href);
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
            const childActive = pathname?.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => isOpen && setIsOpen(false)} // Mobilde sidebar kapanacak
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
