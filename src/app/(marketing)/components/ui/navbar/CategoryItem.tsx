"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export const CategoryItem: React.FC<{ cat: Category; level?: number }> = ({
  cat,
  level = 0,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasChildren = cat.children && cat.children.length > 0;

  // Dışarı tıklandığında veya mouse uzaklaştığında menüyü güvenle kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ANA KATEGORİ (Level 0) ---
  if (level === 0) {
    return (
      <div 
        className="relative inline-flex items-center text-left" 
        ref={dropdownRef}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Ana Kategori Linki (Artık direkt tıklanıp sayfasına gidiyor!) */}
        <Link
          href={`/category/${cat.slug}`}
          onClick={() => setOpen(false)}
          className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            open
              ? "text-pink-600 dark:text-pink-400 bg-pink-50/90 dark:bg-gray-800 shadow-sm"
              : "text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/60"
          }`}
        >
          <span>{cat.name}</span>
        </Link>

        {/* Eğer alt kategorileri varsa, yanına ayrı bir ok butonu koyuyoruz ki hem kategoriye hem menüye ayrı ayrı basılabilsin */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
            onMouseEnter={() => setOpen(true)}
            className="p-1.5 text-gray-500 hover:text-pink-600 transition-colors rounded-lg focus:outline-none"
            aria-label={`${cat.name} alt kategorilerini aç`}
          >
            <FiChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                open ? "rotate-180 text-pink-600" : ""
              }`}
            />
          </button>
        )}

        {/* Açılır Menü Paneli */}
        {hasChildren && open && (
          <div className="absolute left-0 top-full pt-2 w-60 z-50 transform origin-top animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 px-1.5 backdrop-blur-md">
              
              {/* Tümünü Gör Butonu */}
              <Link
                href={`/category/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-xs font-bold tracking-wide uppercase text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-gray-800 rounded-xl mb-1 transition-colors"
              >
                Tüm {cat.name} Ürünleri →
              </Link>

              {/* Alt Kategoriler Listesi */}
              <div className="max-h-72 overflow-y-auto space-y-0.5">
                {cat.children?.map((child) => (
                  <CategoryItem key={child.id} cat={child} level={level + 1} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- ALT KATEGORİLER (Level 1 ve Üzeri) ---
  return (
    <div className="w-full">
      <Link
        href={`/category/${cat.slug}`}
        onClick={() => setOpen(false)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/60 dark:hover:bg-gray-800 rounded-xl transition-colors"
      >
        <span className="truncate">{cat.name}</span>
        {hasChildren && <span className="text-xs text-gray-400 ml-1">›</span>}
      </Link>

      {hasChildren && (
        <div className="pl-3 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-gray-800 ml-2">
          {cat.children?.map((child) => (
            <CategoryItem key={child.id} cat={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};