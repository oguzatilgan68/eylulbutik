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

interface CategoryItemProps {
  cat: Category;
  level?: number;
  onSelect?: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  cat,
  level = 0,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasChildren = Boolean(cat.children && cat.children.length > 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
    if (onSelect) onSelect();
  };

  const linkBaseStyle = "transition-all duration-200 flex items-center";

  // --- ANA KATEGORİ ---
  if (level === 0) {
    return (
      <div 
        className="relative" 
        ref={containerRef}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link
            href={`/category/${cat.slug}`}
            onClick={handleLinkClick}
            className={`${linkBaseStyle} gap-2 px-3.5 py-2 text-sm font-medium rounded-xl ${
              open
                ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-gray-800 shadow-xs"
                : "text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
            }`}
          >
            <span className="truncate">{cat.name}</span>
          </Link>

          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpen((prev) => !prev);
              }}
              onMouseEnter={() => setOpen(true)}
              className="p-1.5 ml-0.5 text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors focus:outline-none"
              aria-label={`${cat.name} alt kategorilerini aç`}
            >
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  open ? "rotate-180 text-pink-600 dark:text-pink-400" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Açılır Menü Paneli - Yüksek z-index ve şık gölge */}
        {hasChildren && open && (
          <div className="absolute left-0 top-full pt-2 w-60 z-9999 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl py-2 px-1.5 backdrop-blur-xl space-y-1">
              
              <Link
                href={`/category/${cat.slug}`}
                onClick={handleLinkClick}
                className="block px-3 py-2 text-xs font-bold tracking-wider uppercase text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Tüm {cat.name} Ürünleri →
              </Link>

              <div className="max-h-72 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                {cat.children?.map((child) => (
                  <CategoryItem 
                    key={child.id} 
                    cat={child} 
                    level={level + 1} 
                    onSelect={onSelect} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- ALT KATEGORİLER ---
  return (
    <div className="w-full">
      <Link
        href={`/category/${cat.slug}`}
        onClick={handleLinkClick}
        className={`${linkBaseStyle} justify-between w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/60 dark:hover:bg-gray-800/60 rounded-xl transition-colors`}
      >
        <span className="truncate">{cat.name}</span>
        {hasChildren && <span className="text-xs text-gray-400 ml-1">›</span>}
      </Link>

      {hasChildren && (
        <div className="pl-3 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-gray-800 ml-2">
          {cat.children?.map((child) => (
            <CategoryItem 
              key={child.id} 
              cat={child} 
              level={level + 1} 
              onSelect={onSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};