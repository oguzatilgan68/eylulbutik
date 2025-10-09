"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  slug: string;
}

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Dışarı tıklanınca dropdown kapanması
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ürün arama isteği (debounced + loading + iptal edilebilir)
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch(`/api/search-products?search=${query}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (slug: string) => {
    router.push(`/product/${slug}`);
    setQuery("");
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute z-[9999] w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mt-2 rounded-md shadow-lg max-h-60 overflow-auto"
          style={{ top: "100%", left: 0 }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">
                Aranıyor...
              </span>
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item.slug)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            query.length >= 3 && (
              <div className="py-3 text-center text-gray-500 text-sm">
                Sonuç bulunamadı.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
