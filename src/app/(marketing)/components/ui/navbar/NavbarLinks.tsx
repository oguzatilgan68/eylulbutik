"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, User, Heart } from "lucide-react";
import { useUser } from "@/app/(marketing)/context/userContext";

export const NavbarLinks = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  return (
    <div className="flex items-center gap-4">
      <Link
        href={user ? "/account" : "/login"}
        className="flex items-center gap-1 hover:text-pink-500"
      >
        <User size={20} />
        <span className="hidden sm:inline">
          {user ? "Hesabım" : "Giriş Yap"}
        </span>
      </Link>

      <Link
        href="/account/wishlist"
        className="flex items-center gap-1 hover:text-pink-500"
      >
        <Heart size={20} />
        <span className="hidden sm:inline">Favorilerim</span>
      </Link>

      <Link
        href="/cart"
        className="flex items-center gap-1 hover:text-pink-500"
      >
        <ShoppingCart size={20} />
        <span className="hidden sm:inline">Sepetim</span>
      </Link>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </button>
    </div>
  );
};
