"use client";

import { useState, useEffect } from "react";
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

export const MarketingNavbar: React.FC<{ categories?: Category[] }> = ({
  categories = [], // Eğer undefined gelirse varsayılan olarak boş dizi atar
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sayfa kaydırıldığında navbar'a şık bir gölge kazandırmak için
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Güvenlik kontrolü: categories gerçekten bir dizi mi? Değilse boş dizi kabul et
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <>
      {/* Üst Kampanya / Duyuru Bandı */}
      <div className="bg-pink-600 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium tracking-wide">
        ✨ 1500 TL ve Üzeri Alışverişlerde Kargo Bedava! ✨
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md ${
          isScrolled
            ? "shadow-md border-b border-gray-100 dark:border-gray-800"
            : "border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        {/* ÜST NAVBAR (Logo, Arama, Kullanıcı Linkleri) */}
        <div className="w-full max-w-7xl mx-auto py-3 flex items-center justify-between gap-4 px-4">
          {/* Mobil Menü Butonu */}
          <button
            className="sm:hidden text-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
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
        <div className="sm:hidden w-full px-4 pb-3">
          <SearchBar />
        </div>

        {/* ALT NAVBAR - Masaüstü Kategoriler */}
        <nav className="hidden sm:block bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-6 px-4 py-2 text-sm sm:text-base">
            {safeCategories.length > 0 ? (
              safeCategories.map((cat) => (
                <CategoryItem key={cat.id} cat={cat} />
              ))
            ) : (
              <span className="text-xs text-gray-400 py-1">Kategoriler Yükleniyor...</span>
            )}
          </div>
        </nav>
      </header>

      {/* Mobil Sidebar */}
      <MobileSidebar
        categories={safeCategories}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};