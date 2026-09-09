"use client";

import Link from "next/link";
import {
  FiHeart,
  FiMapPin,
  FiShoppingBag,
  FiRotateCcw,
  FiKey,
  FiCreditCard,
  FiMessageCircle,
  FiHelpCircle,
  FiPhone,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import { useUser } from "../(marketing)/context/userContext";
import LogoutButton from "../(marketing)/components/ui/LogoutButton";

export default function AccountPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
          <span>Hesap bilgileri yükleniyor...</span>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { href: "/account/orders", label: "Siparişlerim", icon: <FiShoppingBag size={22} className="text-pink-600" /> },
    { href: "/account/addresses", label: "Adreslerim", icon: <FiMapPin size={22} className="text-pink-600" /> },
    { href: "/account/wishlist", label: "Favorilerim", icon: <FiHeart size={22} className="text-pink-600" /> },
    { href: "/account/myreviews", label: "Yorumlarım", icon: <FiMessageCircle size={22} className="text-pink-600" /> },
  ];

  const otherLinks = [
    { href: "/account/returns", label: "İadelerim", icon: <FiRotateCcw className="text-gray-500 dark:text-gray-400" /> },
    { href: "/account/change-password", label: "Şifre Değiştir", icon: <FiKey className="text-gray-500 dark:text-gray-400" /> },
    { href: "/account/cards", label: "Kayıtlı Kartlarım", icon: <FiCreditCard className="text-gray-500 dark:text-gray-400" /> },
  ];

  const supportLinks = [
    { href: "/sss", label: "Sıkça Sorulan Sorular", icon: <FiHelpCircle className="text-gray-500 dark:text-gray-400" /> },
    { href: "/account/support", label: "Müşteri Hizmetleri", icon: <FiPhone className="text-gray-500 dark:text-gray-400" /> },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Üst Profil Kartı */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-pink-500/20">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FiUser size={24} />}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {user.fullName || "Değerli Müşterimiz"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {user.phone ? `0${user.phone}` : user.email}
            </p>
          </div>
        </div>
        <Link
          href="/account/my-info"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-pink-500/50 text-pink-600 dark:text-pink-400 text-xs font-semibold hover:bg-pink-50 dark:hover:bg-gray-800 transition-all shadow-sm whitespace-nowrap"
        >
          Kişisel Bilgilerim
        </Link>
      </div>

      {/* Sık Kullanılanlar Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Hızlı Erişim
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-pink-500/50 hover:shadow-md transition-all group"
            >
              <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-gray-800 dark:text-gray-200 text-xs font-semibold">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Diğer İşlemler */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Hesap Ayarları
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
          {otherLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <FiChevronRight className="text-gray-400" size={16} />
            </Link>
          ))}
        </div>
      </div>

      {/* Yardım & Destek */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Yardım & Destek
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
          {supportLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <FiChevronRight className="text-gray-400" size={16} />
            </Link>
          ))}
          <div className="p-2">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}