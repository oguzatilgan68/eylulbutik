"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import { FiShield, FiHeart } from "react-icons/fi";

export const Footer = () => {
  const year = new Date().getFullYear();
  const genericData = useContext(UserContext)?.genericData;

  const categoryLinks = [
    { name: "Tişört Koleksiyonu", href: "/category/tisort" },
    { name: "Pantolon Modelleri", href: "/category/pantolon" },
  ];

  const accountLinks = [
    { name: "Giriş Yap", href: "/login" },
    { name: "Kayıt Ol", href: "/register" },
    { name: "Siparişlerim", href: "/account/orders" },
    { name: "Favorilerim", href: "/account/wishlist" },
  ];

  const informLinks = [
    { name: "İade Koşulları", href: "/return-conditions" },
    { name: "Sıkça Sorulan Sorular", href: "/sss" },
    { name: "Gizlilik Politikası", href: "/privacy-policy" },
  ];

  const renderLinks = (links: { name: string; href: string }[]) => (
    <ul className="space-y-2.5 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors inline-block"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 pt-16 pb-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Kategoriler */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
            Kategoriler
          </h3>
          {renderLinks(categoryLinks)}
        </div>

        {/* Hesabım */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
            Hesabım
          </h3>
          {renderLinks(accountLinks)}
        </div>

        {/* Bilgilendirme */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
            Kurumsal
          </h3>
          {renderLinks(informLinks)}
        </div>

        {/* İletişim & Sosyal Medya */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
            İletişim & Destek
          </h3>
          <div className="space-y-2.5 text-sm">
            {genericData?.email && (
              <a
                href={`mailto:${genericData.email}`}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                aria-label={`E-posta gönder: ${genericData.email}`}
              >
                <FaEnvelope className="mr-2.5 text-pink-600 shrink-0" size={14} />
                <span className="truncate">{genericData.email}</span>
              </a>
            )}

            {genericData?.phone && (
              <a
                href={`tel:+90${genericData.phone}`}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                aria-label={`Telefon et: ${genericData.phone}`}
              >
                <FaPhoneAlt className="mr-2.5 text-pink-600 shrink-0" size={14} />
                <span>{genericData.phone}</span>
              </a>
            )}

            {genericData?.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  genericData.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                aria-label={`Adresi haritada aç: ${genericData.address}`}
              >
                <FaMapMarkerAlt className="mr-2.5 text-pink-600 shrink-0 mt-1" size={14} />
                <span className="leading-relaxed">{genericData.address}</span>
              </a>
            )}
          </div>

          {/* Sosyal Medya İkonları */}
          <div className="flex items-center gap-3 pt-2">
            {genericData?.facebookUrl && (
              <Link
                href={genericData?.facebookUrl}
                aria-label="Facebook"
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 transition-all shadow-sm"
              >
                <FaFacebookF size={15} />
              </Link>
            )}
            {genericData?.instagramUrl && (
              <Link
                href={
                  genericData?.instagramUrl.startsWith("http")
                    ? genericData?.instagramUrl
                    : `https://instagram.com/${genericData?.instagramUrl}`
                }
                aria-label="Instagram"
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/50 transition-all shadow-sm"
              >
                <FaInstagram size={15} />
              </Link>
            )}
            {genericData?.tiktokUrl && (
              <Link
                href={
                  genericData?.tiktokUrl.startsWith("http")
                    ? genericData?.tiktokUrl
                    : `https://tiktok.com/@${genericData?.tiktokUrl}`
                }
                aria-label="Tiktok"
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:text-black dark:hover:text-white transition-all shadow-sm"
              >
                <FaTiktok size={15} />
              </Link>
            )}
            {genericData?.youtubeUrl && (
              <Link
                href={
                  genericData?.youtubeUrl.startsWith("http")
                    ? genericData?.youtubeUrl
                    : `https://youtube.com/@${genericData?.youtubeUrl}`
                }
                aria-label="Youtube"
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 transition-all shadow-sm"
              >
                <FaYoutube size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Alt Bilgi / Güvenli Alışveriş ve Telif */}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left flex items-center justify-center gap-1.5">
          © {year} <strong className="text-gray-800 dark:text-gray-200">{genericData?.brandName || "Eylül Butik"}</strong>. Tüm hakları saklıdır.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
            <FiShield className="text-emerald-500" size={14} /> 256-bit SSL Güvenli Alışveriş
          </div>
          <Image
            width={113}
            height={20}
            src="/guvenli-alisveris.png"
            alt="Güvenli Alışveriş"
            className="opacity-80 dark:invert"
          />
        </div>
      </div>
    </footer>
  );
};