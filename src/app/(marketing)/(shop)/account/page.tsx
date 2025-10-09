"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "../../context/userContext";
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
  FiLogOut,
} from "react-icons/fi";
import LogoutButton from "../../components/ui/LogoutButton";

export default function AccountPage() {
  const { user } = useUser();
  if (!user) return <p className="text-center py-10">Yükleniyor...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Üst Bilgi Kartı */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
              {user.fullName}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {user.phone ? `0${user.phone}` : user.email}
            </p>
          </div>
        </div>
        <Link
          href="/account/my-info"
          className="border border-pink-500 text-pink-500 px-3 py-1 rounded-full text-sm font-medium hover:bg-pink-50 dark:hover:bg-gray-700 transition"
        >
          Bilgilerim
        </Link>
      </div>

      {/* Sık Kullanılanlar */}
      <div className="p-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Sık Kullanılanlar
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/account/orders"
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
          >
            <FiShoppingBag className="text-pink-500 text-2xl mb-1" />
            <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
              Siparişlerim
            </span>
          </Link>
          <Link
            href="/account/addresses"
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
          >
            <FiMapPin className="text-pink-500 text-2xl mb-1" />
            <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
              Adreslerim
            </span>
          </Link>
          <Link
            href="/account/wishlist"
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
          >
            <FiHeart className="text-pink-500 text-2xl mb-1" />
            <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
              Favorilerim
            </span>
          </Link>
          <Link
            href="/account/myreviews"
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
          >
            <FiMessageCircle className="text-pink-500 text-2xl mb-1" />
            <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
              Yorumlarım
            </span>
          </Link>
        </div>
      </div>

      {/* Diğer İşlemler */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Diğer İşlemler
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-700">
          <Link
            href="/account/returns"
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-3">
              <FiRotateCcw className="text-gray-500 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-200">
                İadelerim
              </span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link
            href="/account/change-password"
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-3">
              <FiKey className="text-gray-500 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-200">
                Şifre Değiştir
              </span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link
            href="/account/cards"
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-3">
              <FiCreditCard className="text-gray-500 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-200">
                Kayıtlı Kredi/Banka Kartlarım
              </span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </div>
      </div>

      {/* Yardım & Destek */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Yardım & Destek
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-700">
          <Link
            href="/sss"
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-3">
              <FiHelpCircle className="text-gray-500 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-200">
                Sıkça Sorulan Sorular
              </span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link
            href="/account/support"
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-3">
              <FiPhone className="text-gray-500 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-200">
                Müşteri Hizmetleri
              </span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
