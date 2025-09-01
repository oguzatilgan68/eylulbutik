"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export const MarketingNavbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          MyShop
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/shop">Mağaza</Link>
          <Link href="/about">Hakkımızda</Link>
          <Link href="/contact">İletişim</Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};
