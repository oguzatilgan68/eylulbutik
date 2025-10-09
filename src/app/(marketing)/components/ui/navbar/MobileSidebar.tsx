"use client";

import Link from "next/link";
import { useState } from "react";
import { FiX, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { SearchBar } from "./SearchBar";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface Props {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<Props> = ({
  categories,
  isOpen,
  onClose,
}) => {
  const [current, setCurrent] = useState<Category | null>(null);

  const handleBack = () => setCurrent(null);

  const handleLinkClick = () => {
    onClose();
    setCurrent(null);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Arkaplan */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar kutusu */}
      <div
        className={`relative bg-white dark:bg-gray-900 w-72 h-full p-4 shadow-xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Üst bar */}
        <div className="flex items-center justify-between mb-4">
          {current ? (
            <button
              onClick={handleBack}
              className="text-gray-700 dark:text-gray-200 flex items-center gap-1"
            >
              <FiChevronLeft />
              Geri
            </button>
          ) : (
            <span className="font-semibold text-lg">Kategoriler</span>
          )}
          <button
            onClick={onClose}
            className="text-2xl text-gray-700 dark:text-gray-200"
            aria-label="Menüyü kapat"
          >
            <FiX />
          </button>
        </div>
        {/* Menü içeriği */}
        <div className="flex-1 overflow-y-auto">
          {!current &&
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={handleLinkClick}
                  className="text-gray-800 dark:text-gray-100"
                >
                  {cat.name}
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <button
                    onClick={() => setCurrent(cat)}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    <FiChevronRight />
                  </button>
                )}
              </div>
            ))}

          {current &&
            current.children?.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 pl-2"
              >
                <Link
                  href={`/category/${sub.slug}`}
                  onClick={handleLinkClick}
                  className="text-gray-800 dark:text-gray-100"
                >
                  {sub.name}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
