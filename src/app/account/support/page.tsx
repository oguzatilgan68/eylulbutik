"use client";

import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { UserContext } from "@/app/(marketing)/context/userContext";
import Link from "next/link";
import React, { useContext } from "react";
import { FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

import { FiMail, FiHeadphones } from "react-icons/fi";

const CustomerService: React.FC = () => {
  const genericData = useContext(UserContext)?.genericData;
  if (!genericData) return null;

  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Müşteri Hizmetleri" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbs} />

      <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto shadow-inner">
            <FiHeadphones size={26} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Müşteri Destek Merkezi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Her türlü soru, beden değişimi, sipariş takibi ve destek talepleriniz için aşağıdaki iletişim kanallarından bize kolayca ulaşabilirsiniz.
          </p>
        </div>

        {/* Sosyal Medya & İletişim Kanalları Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {genericData.email && (
            <Link
              href={`mailto:${genericData.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-pink-500/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group"
              aria-label={`E-posta: ${genericData.email}`}
            >
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <FiMail size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">E-posta Gönder</span>
            </Link>
          )}

          {genericData.phone && (
            <Link
              href={`https://wa.me/${genericData.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-pink-500/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group"
              aria-label="WhatsApp Destek"
            >
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <FaWhatsapp size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">WhatsApp Destek</span>
            </Link>
          )}

          {genericData.instagramUrl && (
            <Link
              href={
                genericData?.instagramUrl.startsWith("http")
                  ? genericData?.instagramUrl
                  : `https://instagram.com/${genericData?.instagramUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-pink-500/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group"
              aria-label="Instagram"
            >
              <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <FaInstagram size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Instagram</span>
            </Link>
          )}

          {genericData.phone && (
            <Link
              href={`tel:+90${genericData.phone}`}
              className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-pink-500/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group"
              aria-label="Telefon ile Ara"
            >
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <FaPhoneAlt size={20} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Telefonla Ara</span>
            </Link>
          )}
        </div>

        {/* Adres Bilgisi Harita Kartı */}
        {genericData?.address && (
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 shrink-0">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Merkez Ofis / Mağaza</h4>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{genericData.address}</p>
              </div>
            </div>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                genericData.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:border-pink-500 transition-all whitespace-nowrap shadow-sm"
              aria-label={`Adresi haritada aç: ${genericData.address}`}
            >
              Haritada Aç →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerService;