"use client";

import React from "react";
import Link from "next/link";

export const ShopNavbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold dark:text-white">
          MyShop
        </Link>
        <div className="flex space-x-4">
          <Link
            href="/shop"
            className="text-gray-700 dark:text-gray-200 hover:underline"
          >
            Katalog
          </Link>
          <Link
            href="/cart"
            className="text-gray-700 dark:text-gray-200 hover:underline"
          >
            Sepet
          </Link>
          <Link
            href="/account"
            className="text-gray-700 dark:text-gray-200 hover:underline"
          >
            Hesabım
          </Link>
        </div>
      </div>
    </nav>
  );
};
