"use client";

import { BrandLogo } from "./navbar/BrandLogo";
import { CategoryItem } from "./navbar/CategoryItem";
import { NavbarLinks } from "./navbar/NavbarLinks";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export const MarketingNavbar: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  return (
    <header className="shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ÜST NAVBAR */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <BrandLogo />
        <div className="hidden sm:block w-full max-w-md">
          {/* 🔍 Arama Barı buraya gelecek */}
        </div>
        <NavbarLinks />
      </div>

      {/* ALT NAVBAR - Kategoriler */}
      <nav className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-2 flex gap-6 overflow-x-auto text-sm sm:text-base">
          {categories.map((cat) => (
            <CategoryItem key={cat.id} cat={cat} />
          ))}
        </div>
      </nav>
    </header>
  );
};
