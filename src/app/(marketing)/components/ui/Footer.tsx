"use client";

import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-6 mt-12">
      <div className="max-w-7xl mx-auto text-center">
        <p>© {new Date().getFullYear()} MyShop. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};
