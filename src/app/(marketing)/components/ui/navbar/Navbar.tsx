"use client";

import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { BrandLogo } from "./BrandLogo"; 
import { NavbarLinks } from "./NavbarLinks";
import { SearchBar } from "./SearchBar";
import { MobileSidebar } from "./MobileSidebar";
import { CategoryItem } from "./CategoryItem"; // Kendi dosya konumuna göre ayarlayabilirsin (örn: ./navbar/CategoryItem)

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface NavbarProps {
  categories?: Category[];
}

export const Navbar: React.FC<NavbarProps> = ({ categories = [] }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Güvenlik kontrolü
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Kullanıcı aşağı kaydırdığında navbar'a hafif gölge efekti eklemek için
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

  return (
    <>
      {/* Üst Duyuru / Kampanya Bandı */}
      <div className="bg-pink-600 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium tracking-wide">
        ✨ 500 TL ve Üzeri Alışverişlerde Kargo Bedava! ✨
      </div>

      {/* Ana Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md ${
          isScrolled
            ? "shadow-md border-b border-gray-100 dark:border-gray-800"
            : "border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Sol Taraf: Mobil Menü Butonu + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label="Mobil Menüyü Aç"
              >
                <FiMenu size={24} />
              </button>
              <BrandLogo />
            </div>

            {/* Orta Taraf: Arama Çubuğu */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <SearchBar />
            </div>

            {/* Sağ Taraf: Linkler (Hesap, Favori, Sepet, Tema) */}
            <div className="flex items-center">
              <NavbarLinks />
            </div>
          </div>

          {/* Mobil Arama Çubuğu */}
          <div className="mt-3 md:hidden">
            <SearchBar />
          </div>
        </div>

        {/* ALT NAVBAR - Masaüstü Kategoriler (CategoryItem entegrasyonu) */}
        <nav className="hidden lg:block bg-gray-50/80 dark:bg-gray-800/40 border-t border-gray-200/60 dark:border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 px-4 py-1.5">
            {safeCategories.length > 0 ? (
              safeCategories.map((cat) => (
                <CategoryItem key={cat.id} cat={cat} level={0} />
              ))
            ) : (
              <span className="text-xs text-gray-400 py-1">Kategoriler Yükleniyor...</span>
            )}
          </div>
        </nav>
      </header>

      {/* Mobil Sidebar Menüsü */}
      <MobileSidebar
        categories={safeCategories}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};