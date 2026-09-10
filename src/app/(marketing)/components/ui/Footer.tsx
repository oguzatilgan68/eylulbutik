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
  FaWhatsapp,
} from "react-icons/fa";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import { FiShield } from "react-icons/fi";

export const Footer = () => {
  const year = new Date().getFullYear();
  const genericData = useContext(UserContext)?.genericData;

  // Kontrast oranı artırıldı (text-gray-600 yerine gray-700, dark-gray-400 yerine gray-200/300)
  const linkBaseClass = "text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors";

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
    { name: "İletişim", href: "/contact" },
  ];

  const renderLinks = (links: { name: string; href: string }[]) => (
    <ul className="space-y-2.5 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            target="_self"
            rel="noopener noreferrer"
            className={`${linkBaseClass} inline-block`}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  const contactItems = [
    genericData?.email && {
      href: `mailto:${genericData.email}`,
      label: `E-posta gönder: ${genericData.email}`,
      icon: <FaEnvelope className="mr-2.5 text-pink-600 dark:text-pink-500 shrink-0" size={14} />,
      text: genericData.email,
      truncate: true,
    },
    genericData?.phone && {
      href: `tel:${genericData.phone}`,
      label: `Telefon et: ${genericData.phone}`,
      icon: <FaPhoneAlt className="mr-2.5 text-pink-600 dark:text-pink-500 shrink-0" size={14} />,
      text: genericData.phone,
    },
    genericData?.phone && {
      href: `https://wa.me/${genericData.phone.replace(/\D/g, "")}`,
      label: `WhatsApp: ${genericData.phone}`,
      icon: <FaWhatsapp className="mr-2.5 text-pink-600 dark:text-pink-500 shrink-0" size={14} />,
      text: genericData.phone,
    },
    genericData?.address && {
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(genericData.address)}`,
      label: `Adresi haritada aç: ${genericData.address}`,
      icon: <FaMapMarkerAlt className="mr-2.5 text-pink-600 dark:text-pink-500 shrink-0 mt-1" size={14} />,
      text: genericData.address,
      isAddress: true,
    },
  ].filter(Boolean);

  const socialLinks = [
    genericData?.facebookUrl && {
      href: genericData.facebookUrl,
      label: "Facebook",
      icon: <FaFacebookF size={15} />,
      hoverClass: "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50",
    },
    genericData?.instagramUrl && {
      href: genericData.instagramUrl.startsWith("http")
        ? genericData.instagramUrl
        : `https://instagram.com/${genericData.instagramUrl}`,
      label: "Instagram",
      icon: <FaInstagram size={15} />,
      hoverClass: "hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/50",
    },
    genericData?.tiktokUrl && {
      href: genericData.tiktokUrl.startsWith("http")
        ? genericData.tiktokUrl
        : `https://tiktok.com/@${genericData.tiktokUrl}`,
      label: "Tiktok",
      icon: <FaTiktok size={15} />,
      hoverClass: "hover:bg-gray-100 hover:text-black dark:hover:text-white",
    },
    genericData?.youtubeUrl && {
      href: genericData.youtubeUrl.startsWith("http")
        ? genericData.youtubeUrl
        : `https://youtube.com/@${genericData.youtubeUrl}`,
      label: "Youtube",
      icon: <FaYoutube size={15} />,
      hoverClass: "hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50",
    },
  ].filter(Boolean);

  const sectionTitleClass = "text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2";

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 pt-16 pb-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Kategoriler */}
        <div className="space-y-4">
          <h3 className={sectionTitleClass}>Kategoriler</h3>
          {renderLinks(categoryLinks)}
        </div>

        {/* Hesabım */}
        <div className="space-y-4">
          <h3 className={sectionTitleClass}>Hesabım</h3>
          {renderLinks(accountLinks)}
        </div>

        {/* Kurumsal */}
        <div className="space-y-4">
          <h3 className={sectionTitleClass}>Kurumsal</h3>
          {renderLinks(informLinks)}
        </div>

        {/* İletişim & Sosyal Medya */}
        <div className="space-y-4">
          <h3 className={sectionTitleClass}>İletişim & Destek</h3>
          <div className="space-y-2.5 text-sm">
            {contactItems.map((item, index) => (
              item && (
                <Link
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkBaseClass} ${item.isAddress ? "flex items-start" : "flex items-center"}`}
                  aria-label={item.label}
                >
                  {item.icon}
                  <span className={item.truncate ? "truncate" : item.isAddress ? "leading-relaxed" : undefined}>
                    {item.text}
                  </span>
                </Link>
              )
            ))}
          </div>

          {/* Sosyal Medya İkonları */}
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map((social, index) => (
              social && (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-all shadow-sm ${social.hoverClass}`}
                >
                  {social.icon}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Alt Bilgi / Güvenli Alışveriş ve Telif */}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-600 dark:text-gray-300 text-center sm:text-left flex items-center justify-center gap-1.5">
          © {year} <strong className="text-gray-900 dark:text-white">{genericData?.brandName || "Eylül Butik"}.</strong> Tüm hakları saklıdır.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
            <FiShield className="text-emerald-600 dark:text-emerald-400" size={14} /> 256-bit SSL Güvenli Alışveriş
          </div>
          <Image
            width={113}
            height={20}
            src="/guvenli-alisveris.png"
            alt="Güvenli Alışveriş"
            className="opacity-90 dark:invert"
          />
        </div>
      </div>
    </footer>
  );
};