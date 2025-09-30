"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, User, Search, Heart } from "lucide-react";
import { useUser } from "@/app/(marketing)/context/userContext";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

const CategoryItem: React.FC<{ cat: Category; level?: number }> = ({
  cat,
  level = 0,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={() => setOpen(!open)}
        className={`flex justify-between w-full px-4 py-2 hover:text-pink-500 transition-colors ${
          level === 0 ? "font-semibold" : "font-normal"
        }`}
      >
        <span>{cat.name}</span>
        {cat.children && cat.children.length > 0 && (
          <span className="ml-2 text-xs">{open ? "▲" : "▼"}</span>
        )}
      </button>

      {/* Dropdown - masaüstü */}
      {cat.children && cat.children.length > 0 && (
        <div
          className={`absolute left-0 top-full mt-1 min-w-max bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 
          ${level === 0 ? "hidden group-hover:block" : ""}`}
        >
          {cat.children.map((child) => (
            <CategoryItem key={child.id} cat={child} level={level + 1} />
          ))}
        </div>
      )}

      {/* Mobil - açılır akordeon */}
      {cat.children && cat.children.length > 0 && open && (
        <div className="pl-4 sm:hidden border-l border-gray-200 dark:border-gray-700">
          {cat.children.map((child) => (
            <CategoryItem key={child.id} cat={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const MarketingNavbar: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  return (
    <header className="shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ÜST NAVBAR */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-pink-500 text-white px-2 py-1 rounded">E</span>
          Eylül Butik
        </Link>

        <div className="hidden sm:block w-full max-w-md">{/* Arama */}</div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-1 hover:text-pink-500"
            >
              <User size={20} />
              <span className="hidden sm:inline">Hesabım</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 hover:text-pink-500"
            >
              <User size={20} />
              <span className="hidden sm:inline">Giriş Yap</span>
            </Link>
          )}
          <Link
            href="/account/wishlist"
            className="flex items-center gap-1 hover:text-pink-500"
          >
            <Heart size={20} />
            <span className="hidden sm:inline">Favorilerim</span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1 hover:text-pink-500"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Sepetim</span>
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
      </div>

      {/* ALT NAVBAR - Kategoriler */}
      <nav className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-2 flex gap-6 overflow-x-auto text-sm sm:text-base relative">
          {categories.map((cat) => (
            <CategoryItem key={cat.id} cat={cat} />
          ))}
        </div>
      </nav>
    </header>
  );
};
