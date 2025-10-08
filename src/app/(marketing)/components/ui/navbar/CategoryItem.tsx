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
          className="flex-1 text-left py-2 px-2 hover:text-pink-500 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          aria-label={`${cat.name} kategorisine git`}
        >
          {cat.name}
        </Link>

        {/* Alt kategori aç/kapat */}
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="ml-2 p-2 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label={
              open
                ? `${cat.name} alt kategorilerini kapat`
                : `${cat.name} alt kategorilerini aç`
            }
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
