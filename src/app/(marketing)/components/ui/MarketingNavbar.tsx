"use client";

import { useState, useEffect } from "react";
import { BrandLogo } from "./navbar/BrandLogo";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { CategoryItem } from "./navbar/CategoryItem";
import { MobileSidebar } from "./navbar/MobileSidebar";
import { SearchBar } from "./navbar/SearchBar";
import { FiAlertCircle, FiMenu, FiTruck } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export const MarketingNavbar: React.FC<{ categories?: Category[] }> = ({
  categories = [],
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <>
      {/* 🚀 Üst Kampanya / Duyuru Bandı - Daha Şık, Gradient ve Canlı */}
      <div className="relative bg-linear-to-r from-pink-600 via-rose-500 to-purple-600 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide shadow-inner overflow-hidden">
        {/* Arka plan dekoratif parıltı efekti */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-center gap-2">
          <FiTruck className="animate-bounce shrink-0" size={16} />
          <span className="font-semibold">1500 TL ve Üzeri Alışverişlerde Kargo Bedava!</span>
          <span className="hidden md:inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] backdrop-blur-sm">
            <FiAlertCircle size={12} /> Kaçırma
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md ${
          isScrolled
            ? "shadow-lg shadow-gray-200/50 dark:shadow-black/20 border-b border-gray-100 dark:border-gray-800"
            : "border-b border-gray-200/80 dark:border-gray-800"
        }`}
      >
        {/* ÜST NAVBAR (Logo, Arama, Kullanıcı Linkleri) */}
        <div className="w-full max-w-7xl mx-auto py-3.5 flex items-center justify-between gap-4 px-4 sm:px-6">
          {/* Mobil Menü Butonu */}
          <button
            className="sm:hidden text-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors cursor-pointer"
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
        <div className="sm:hidden w-full px-4 pb-3.5">
          <SearchBar />
        </div>

        {/* ALT NAVBAR - Masaüstü Kategoriler */}
        <nav className="hidden sm:block bg-linear-to-b from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-900/40 border-t border-gray-200/60 dark:border-gray-800">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-1 sm:gap-4 px-4 py-2.5 text-sm overflow-x-auto scrollbar-none">
            {safeCategories.length > 0 ? (
              safeCategories.map((cat) => (
                <div key={cat.id} className="shrink-0">
                  <CategoryItem cat={cat} />
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-400 py-1 font-medium animate-pulse">
                Kategoriler yükleniyor...
              </span>
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