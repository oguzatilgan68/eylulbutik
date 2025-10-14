"use client";

import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { UserContext } from "@/app/(marketing)/context/userContext";
import Link from "next/link";
import React, { useContext } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaMailBulk,
  FaMapMarkerAlt,
} from "react-icons/fa";

const CustomerService: React.FC = () => {
  const genericData = useContext(UserContext)?.genericData;
  if (!genericData) return null; // Veri yüklenmediyse sayfayı render etme
  const breadcrumbs = [
    {
      label: "Hesabım",
      href: "/account",
    },
    {
      label: "Müşteri Hizmetleri",
    },
  ];
  return (
    <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 md:px-8 lg:px-16">
      <Breadcrumb items={breadcrumbs} />
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Müşteri Hizmetleri
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 max-w-2xl">
          Her türlü soru, öneri ve destek talepleriniz için bize
          ulaşabilirsiniz.
        </p>

        {/* Sosyal Medya */}
        <div className="flex flex-wrap justify-center gap-6">
          {genericData.email && (
            <Link
              href={`mailto:${genericData.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
              aria-label={`E-posta gönder: ${genericData.email}`}
            >
              <FaMailBulk size={28} />
            </Link>
          )}
          {genericData?.facebookUrl && (
            <Link href={genericData?.facebookUrl} aria-label="Facebook">
              <FaFacebookF className="hover:text-blue-600 transition" />
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
              className="text-pink-500 dark:text-pink-400 hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <FaInstagram size={28} />
            </Link>
          )}
          {genericData.phone && (
            <Link
              href={`https://wa.me/${genericData.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 dark:text-green-400 hover:scale-110 transition-transform"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={28} />
            </Link>
          )}
          {genericData.phone && (
            <Link
              href={`tel:+90${genericData.phone}`}
              className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-2"
              aria-label="Telefon"
            >
              <FaPhoneAlt size={28} />
            </Link>
          )}
        </div>

        {/* Adres */}
        {genericData?.address && (
          <Link
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
          </Link>
        )}
      </div>
    </section>
  );
};
export default CustomerService;
