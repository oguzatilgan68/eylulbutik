"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiOutlineShoppingCart, HiOutlineUser } from "react-icons/hi";

export const MarketingNavbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          MyShop
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/shop"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Shop
          </Link>
          <Link
            href="/categories"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Kategoriler
          </Link>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Ara..."
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/account">
            <HiOutlineUser className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </Link>
          <Link href="/cart">
            <HiOutlineShoppingCart className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-800 dark:text-gray-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 py-2 space-y-2">
          <Link href="/" className="block text-gray-800 dark:text-gray-200">
            Ana Sayfa
          </Link>
          <Link href="/shop" className="block text-gray-800 dark:text-gray-200">
            Shop
          </Link>
          <Link
            href="/categories"
            className="block text-gray-800 dark:text-gray-200"
          >
            Kategoriler
          </Link>
          <input
            type="text"
            placeholder="Ara..."
            className="w-full px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
        </div>
      )}
    </nav>
  );
};
