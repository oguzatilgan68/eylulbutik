"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { 
  FiMenu, 
  FiX, 
  FiChevronRight, 
  FiHome, 
  FiBox, 
  FiGrid, 
  FiTag, 
  FiImage, 
  FiShoppingBag, 
  FiUsers, 
  FiUserCheck, 
  FiSettings, 
  FiActivity 
} from "react-icons/fi";

const navLinks = [
  {
    href: "/",
    label: "Anasayfa",
    icon: <FiHome size={18} />,
    children: [{ href: "/", label: "Siteye Git" },
      { href: "/admin", label: "Yönetim Paneli" }
    ],
  },

  {
    href: "/admin/products",
    label: "Ürünler",
    icon: <FiBox size={18} />,
    children: [
      { href: "/admin/products", label: "Ürünler" },
      { href: "/admin/products/new", label: "Yeni Ürün" },
      { href: "/admin/global-properties", label: "Ürün Özellikleri" },
      { href: "/admin/product-properties", label: "Özellik Değerleri" },
      { href: "/admin/attribute-types", label: "Varyasyonlar" },
      { href: "/admin/coupons", label: "Kuponlar" },
      { href: "/admin/reviews", label: "Yorum Yönetimi" },
    ],
  },
  {
    href: "/admin/categories",
    label: "Kategoriler",
    icon: <FiGrid size={18} />,
    children: [
      { href: "/admin/categories", label: "Kategoriler" },
      { href: "/admin/categories/new", label: "Yeni Kategori" },
    ],
  },
  {
    href: "/admin/brands",
    label: "Markalar",
    icon: <FiTag size={18} />,
    children: [
      { href: "/admin/brands", label: "Markalar" },
      { href: "/admin/brands/new", label: "Yeni Marka" },
    ],
  },
  {
    href: "/admin/sliders",
    label: "Ana Sayfa Slayt",
    icon: <FiImage size={18} />,
    children: [
      { href: "/admin/sliders", label: "Slayt Listesi" },
      { href: "/admin/sliders/new", label: "Yeni Ekle" },
    ],
  },
  {
    href: "/admin/orders",
    label: "Siparişler",
    icon: <FiShoppingBag size={18} />,
    children: [
      { href: "/admin/orders", label: "Tüm Siparişler" },
      { href: "/admin/shipment", label: "Kargo Gönderim" },
      { href: "/admin/returns", label: "İadeler" },
      { href: "/admin/bank-transfers", label: "Banka Transferleri" },
    ],
  },
  {
    href: "/admin/customers",
    label: "Müşteriler",
    icon: <FiUsers size={18} />,
    children: [{ href: "/admin/customers", label: "Müşteriler" }],
  },
  {
    href: "/admin/model-info",
    label: "Model Bilgileri",
    icon: <FiUserCheck size={18} />,
    children: [{ href: "/admin/model-info", label: "Model Bilgileri" }],
  },
  {
    href: "/admin/generic-data",
    label: "Site Ayarları",
    icon: <FiSettings size={18} />,
    children: [{ href: "/admin/generic-data", label: "Site Ayarları" }],
  },
  {
    href: "/admin/logs",
    label: "Loglar",
    icon: <FiActivity size={18} />,
    children: [{ href: "/admin/logs", label: "Sistem Logları" }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100/60 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      {/* 📱 Mobil Üst Bar & Menü Tetikleyicisi */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between z-40 shadow-sm">
        <span className="font-bold text-lg text-pink-600 dark:text-pink-400">Eylül Butik Yönetim</span>
        <button
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menüyü aç/kapat"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* 🧭 Sidebar (Yan Menü) */}
      <aside
        className={clsx(
          "fixed lg:static top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Logo / Başlık Alanı */}
        <div className="flex items-center justify-between mb-8 px-2 pt-2 lg:pt-0">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Eylül <span className="text-pink-600 dark:text-pink-400">Admin</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">E-Ticaret Yönetim Paneli</p>
          </div>
        </div>

        {/* Navigasyon Listesi */}
        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 custom-scrollbar">
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

      {/* 🌑 Backdrop Overlay (Mobilde arka planı karartma) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 💻 Ana İçerik Alanı */}
      <main className="flex-1 p-4 sm:p-8 mt-16 lg:mt-0 overflow-x-auto min-w-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

/* --- Helper Component (Menü Elemanları ve Alt Menüler) --- */
function AdminNavLink({
  link,
  setIsOpen,
}: {
  link: (typeof navLinks)[number];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  
  // Eğer aktif link alt kategorilerden biriyse menüyü otomatik açık tut
  const isParentActive = link.children?.some((child) => pathname === child.href);
  const [open, setOpen] = useState(isParentActive);

  const hasChildren = link.children && link.children.length > 0;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => hasChildren && setOpen((prev) => !prev)}
        className={clsx(
          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isParentActive
            ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-semibold"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <span className={clsx(isParentActive ? "text-pink-600 dark:text-pink-400" : "text-gray-400")}>
            {link.icon}
          </span>
          <span>{link.label}</span>
        </div>
        {hasChildren && (
          <FiChevronRight
            size={16}
            className={clsx(
              "text-gray-400 transition-transform duration-200",
              open && "rotate-90 text-pink-600 dark:text-pink-400"
            )}
          />
        )}
      </button>

      {/* Alt Menüler (Açılır Kapanır) */}
      {hasChildren && open && (
        <div className="flex flex-col pl-9 pr-2 space-y-1 my-1 border-l-2 border-pink-100 dark:border-gray-800 ml-4">
          {link.children!.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setIsOpen(false)} // Mobilde tıklandığında menüyü kapat
                className={clsx(
                  "px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors",
                  childActive
                    ? "bg-pink-600 text-white font-medium shadow-sm shadow-pink-500/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
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