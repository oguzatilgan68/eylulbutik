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

export const Footer = () => {
  const year = new Date().getFullYear();

  const genericData = useContext(UserContext)?.genericData;

  const categoryLinks = [
    { name: "Tişört", href: "/category/tisort" },
    { name: "Pantolon", href: "/category/pantolon" },
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
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="hover:underline">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-12 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Kategoriler */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Kategoriler
          </h3>
          {renderLinks(categoryLinks)}
        </div>
        {/* Hesabım */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Hesabım
          </h3>
          {renderLinks(accountLinks)}
        </div>
        {/* Bilgilendirme */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Bilgilendirme
          </h3>
          {renderLinks(informLinks)}
        </div>
        {/* İletişim & Sosyal Medya */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            İletişim
          </h3>
          <div className="space-y-2">
            {genericData?.email && (
              <a
                href={`mailto:${genericData.email}`}
                className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 transition-colors"
                aria-label={`E-posta gönder: ${genericData.email}`}
              >
                <FaEnvelope className="mr-2 text-pink-500" />
                <span>{genericData.email}</span>
              </a>
            )}

            {genericData?.phone && (
              <a
                href={`tel:+90${genericData.phone}`}
                className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 transition-colors"
                aria-label={`Telefon et: ${genericData.phone}`}
              >
                <FaPhoneAlt className="mr-2 text-pink-500" />
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
                className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 transition-colors"
                aria-label={`Adresi haritada aç: ${genericData.address}`}
              >
                <FaMapMarkerAlt className="mr-2 text-pink-500" />
                <span>{genericData.address}</span>
              </a>
            )}
          </div>
          <div className="flex space-x-4 mb-4 mt-3">
            {genericData?.facebookUrl && (
              <Link href={genericData?.facebookUrl} aria-label="Facebook">
                <FaFacebookF className="hover:text-blue-600 transition" />
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
              >
                <FaInstagram className="hover:text-pink-500 transition" />
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
              >
                <FaTiktok className="hover:text-black dark:hover:text-white transition" />
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
              >
                <FaYoutube className="hover:text-red-600 transition" />
              </Link>
            )}
          </div>

          {/* Ödeme ikonları */}
        </div>
        <div className="flex gap-4">
          <Image
            width={113}
            height={20}
            src="/guvenli-alisveris.png"
            alt="Güvenli Alışveriş"
          />
        </div>
      </div>
      {/* Alt kısım */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-4 text-center text-sm">
        <p>
          © {year} {genericData?.brandName} Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};
