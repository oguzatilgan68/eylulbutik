"use client";

import { useState } from "react";
import { BrandLogo } from "./navbar/BrandLogo";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { CategoryItem } from "./navbar/CategoryItem";
import { MobileSidebar } from "./navbar/MobileSidebar";
import { SearchBar } from "./navbar/SearchBar";
import { FiMenu } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export const MarketingNavbar: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="relative shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ÜST NAVBAR */}
      <div className="w-full max-w-7xl mx-auto py-3 flex items-center justify-between gap-4 px-4">
        {/* Mobil Menü Butonu */}
        <button
          className="sm:hidden text-2xl text-gray-700 dark:text-gray-200"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Menüyü aç"
        >
          <FiMenu />
        </button>

        <BrandLogo />

        {/* Masaüstü Arama Alanı */}
        <div className="hidden sm:block w-full max-w-md">
          <SearchBar />
        </div>

        <NavbarLinks />
      </div>

      {/* 🔍 Mobil Arama Alanı */}
      <div className="sm:hidden w-full px-4 pb-2">
        <SearchBar />
      </div>

      {/* ALT NAVBAR - Masaüstü kategoriler */}
      <nav className="hidden sm:block bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="w-full max-w-7xl mx-auto flex gap-4 sm:gap-6 px-4 py-2 text-sm sm:text-base">
          {categories.map((cat) => (
            <CategoryItem key={cat.id} cat={cat} />
          ))}
        </div>
      </nav>

      {/* Mobil Sidebar */}
      <MobileSidebar
        categories={categories}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
};
