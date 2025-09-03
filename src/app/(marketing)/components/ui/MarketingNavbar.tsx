"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, User, Search } from "lucide-react";
import { useUser } from "@/app/(marketing)/context/userContext";
interface Category {
  id: string;
  name: string;
  slug: string;
}

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{
    products: any[];
    categories: any[];
  }>({ products: [], categories: [] });

  // debounce ile öneriler
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.length >= 3) {
        const res = await fetch(`/api/search-suggestions?q=${search}`);
        const data = await res.json();
        setResults(data);
      } else {
        setResults({ products: [], categories: [] });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(search.trim());
    if (search.trim()) {
      setResults({ products: [], categories: [] });
      setSearch("");
    }
  };

  // ✅ dropdown kapatma fonksiyonu
  const clearSearch = () => {
    setResults({ products: [], categories: [] });
    setSearch("");
  };
  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
        <Search className="text-gray-500 dark:text-gray-400 mr-2" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün veya kategori ara..."
          className="bg-transparent w-full focus:outline-none text-sm"
        />
      </div>

      {/* Dropdown Sonuçlar */}
      {(results.products.length > 0 || results.categories.length > 0) && (
        <div className="absolute left-0 right-0 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg mt-1 shadow-lg z-50 max-h-64 overflow-auto">
          {results.categories.length > 0 && (
            <div>
              <p className="px-3 py-1 text-xs text-gray-400">Kategoriler</p>
              {results.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={clearSearch}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
          {results.products.length > 0 && (
            <div>
              <p className="px-3 py-1 text-xs text-gray-400">Ürünler</p>
              {results.products.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={clearSearch}
                >
                  {prod.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export const MarketingNavbar: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useUser(); // UserContext’ten alıyoruz

  return (
    <header className="shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ÜST NAVBAR */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo + Mağaza adı */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-pink-500 text-white px-2 py-1 rounded">M</span>
          ModaMizBir
        </Link>

        {/* Arama */}
        <div className="hidden sm:block w-full max-w-md">
          <SearchBar />
        </div>

        {/* Kullanıcı İşlemleri */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-1 hover:text-pink-500"
            >
              <User size={20} />
              <span className="hidden sm:inline">Hesabım</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 hover:text-pink-500"
            >
              <User size={20} />
              <span className="hidden sm:inline">Giriş Yap</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center gap-1 hover:text-pink-500"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Sepetim</span>
          </Link>

          {/* Dark Mode */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
      </div>

      {/* Mobil Arama */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {/* ALT NAVBAR - Kategoriler */}
      <nav className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-2 flex gap-6 overflow-x-auto text-sm sm:text-base">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="whitespace-nowrap hover:text-pink-500 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};
