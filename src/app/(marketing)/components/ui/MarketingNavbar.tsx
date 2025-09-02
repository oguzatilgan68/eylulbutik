"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const MarketingNavbar: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl tracking-wide">
          ModaMizBir
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="hover:text-pink-500 transition-colors"
            >
              {cat.name}
            </Link>
          ))}

          <Link href="/about" className="hover:text-pink-500">
            Hakkımızda
          </Link>
          <Link href="/contact" className="hover:text-pink-500">
            İletişim
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-3 px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 space-y-3 font-medium">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="block py-2 border-b border-gray-200 dark:border-gray-700 hover:text-pink-500"
              onClick={() => setMobileOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="block py-2 border-b border-gray-200 dark:border-gray-700 hover:text-pink-500"
            onClick={() => setMobileOpen(false)}
          >
            Hakkımızda
          </Link>
          <Link
            href="/contact"
            className="block py-2 border-b border-gray-200 dark:border-gray-700 hover:text-pink-500"
            onClick={() => setMobileOpen(false)}
          >
            İletişim
          </Link>
        </div>
      )}
    </nav>
  );
};
