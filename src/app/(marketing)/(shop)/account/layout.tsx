"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUndo,
  FaUser,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const menuItems = [
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-2 py-4">
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
  );
}
