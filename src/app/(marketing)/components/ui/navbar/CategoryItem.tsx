"use client";
import { useState } from "react";
import Link from "next/link";

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
  const hasChildren = cat.children && cat.children.length > 0;

  return (
    <div className="w-full">
      <div
        className={`flex justify-between items-center w-full px-4 py-3 ${
          level === 0
            ? "font-semibold border-b border-gray-200 dark:border-gray-700"
            : "pl-6 font-normal"
        }`}
      >
        {/* Kategori adı → slug link */}
        <Link
          href={`/category/${cat.slug}`}
          className="hover:text-pink-500 transition-colors flex-1 text-left"
        >
          {cat.name}
        </Link>

        {/* Alt kategori aç/kapat */}
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="ml-2 text-xs text-gray-600 dark:text-gray-300"
          >
            {open ? "−" : "+"}
          </button>
        )}
      </div>

      {/* Alt kategoriler - inline açılır */}
      {hasChildren && open && (
        <div className="flex flex-col border-b border-gray-100 dark:border-gray-700">
          {cat.children?.map((child) => (
            <CategoryItem key={child.id} cat={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
