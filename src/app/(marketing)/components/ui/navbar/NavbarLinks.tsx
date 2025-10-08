"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, User, Heart } from "lucide-react";
import { useUser } from "@/app/(marketing)/context/userContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

export const NavbarLinks = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const navItems: NavItem[] = [
    {
      href: user ? "/account" : "/login",
      label: user ? "Hesabım" : "Giriş Yap",
      icon: <User size={20} />,
      ariaLabel: user ? "Hesabım sayfasına git" : "Giriş yap",
    },
    {
      href: "/account/wishlist",
      label: "Favorilerim",
      icon: <Heart size={20} />,
      ariaLabel: "Favorilerim sayfasına git",
    },
    {
      href: "/cart",
      label: "Sepetim",
      icon: <ShoppingCart size={20} />,
      ariaLabel: "Sepetim sayfasına git",
    },
  ];

  const linkClass =
    "flex items-center gap-1 hover:text-pink-500 transition-colors";

  const btnClass =
    "px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  return (
    <div className="flex items-center gap-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={linkClass}
          aria-label={item.ariaLabel}
        >
          {item.icon}
          <span className="hidden sm:inline">{item.label}</span>
        </Link>
      ))}

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={btnClass}
        aria-label={
          theme === "dark" ? "Aydınlık moda geç" : "Karanlık moda geç"
        }
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </button>
    </div>
  );
};
