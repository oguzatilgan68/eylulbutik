"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBox,
  FaHeart,
  FaHome,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUndo,
  FaUser,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { cn } from "@/lib/utils"; // yoksa bu satırı kaldır ve cn yerine className birleştirmesini string olarak yap

const menuItems = [
  { label: "Ana Sayfa", icon: <FaHome />, href: "/" },
  { label: "Hesabım", icon: <FaUser />, href: "/account" },
  { label: "Siparişlerim", icon: <FaBox />, href: "/account/orders" },
  { label: "Favorilerim", icon: <FaHeart />, href: "/account/wishlist" },
  { label: "Yorumlarım", icon: <FaMessage />, href: "/account/myreviews" },
  { label: "Adreslerim", icon: <FaMapMarkerAlt />, href: "/account/addresses" },
  { label: "İadelerim", icon: <FaUndo />, href: "/account/returns" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const normalizePath = (path: string) => path.replace(/\/+$/, ""); // sondaki slash'ları temizle
  const currentPath = normalizePath(pathname);
  // Menüdeki en uzun eşleşmeyi bul
  const matchedItem = [...menuItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) =>
        currentPath === normalizePath(item.href) ||
        currentPath.startsWith(normalizePath(item.href) + "/")
    );

  const title = matchedItem?.label || "Hesabım";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 🧭 Mobil Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 lg:hidden">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 dark:text-gray-300"
        >
          ← Geri
        </button>
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="w-8" />
      </header>

      {/* 🖥️ Masaüstü düzen */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-2 py-4 flex-1">
        {/* Sol Menü — Sadece desktop görünümde */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                pathname === item.href
                  ? "bg-gray-100 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
            >
              <span className="text-pink-500">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-700/30 transition w-full">
            <FaSignOutAlt className="text-red-500" />
            <span>Çıkış Yap</span>
          </button>
        </aside>

        {/* İçerik Alanı */}
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* 📱 Mobil Alt Menü */}
      <footer className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <nav className="flex justify-around items-center py-2">
          {menuItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center text-xs",
                pathname.startsWith(item.href)
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <div className="text-lg">{item.icon}</div>
              {item.label.split(" ")[0]}{" "}
              {/* Kısa label (ör: Siparişlerim → Siparişler) */}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
