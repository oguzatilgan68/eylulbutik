"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../../context/userContext";
import { FiMapPin, FiPlus, FiCheck, FiArrowRight, FiHome } from "react-icons/fi";

interface Props {
  orderData: any;
  setOrderData: (data: any) => void;
  nextStep: () => void;
}

export default function AddressStep({
  orderData,
  setOrderData,
  nextStep,
}: Props) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    orderData?.addressId || null
  );
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const getUserAddresses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/address");
        if (!res.ok) throw new Error("Adresler alınamadı");
        const data = await res.json();
        const fetchedAddresses = data.addresses || [];
        setAddresses(fetchedAddresses);

        // Eğer daha önceden seçili adres yoksa ve varsayılan adres varsa onu seç
        if (!selectedAddress && fetchedAddresses.length > 0) {
          const defaultAddr = fetchedAddresses.find((a: any) => a.isDefault) || fetchedAddresses[0];
          setSelectedAddress(defaultAddr.id);
        }
      } catch (err) {
        console.error("Adresler alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    getUserAddresses();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Lütfen adres seçimi için giriş yapın.</p>
        <Link href="/login" className="text-pink-600 font-semibold text-xs hover:underline">
          Giriş Yap →
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    if (!selectedAddress) {
      alert("Lütfen bir teslimat adresi seçin.");
      return;
    }
    setOrderData({ ...orderData, addressId: selectedAddress });
    nextStep();
  };

  // 🦴 Modern Skeleton UI (Yükleniyor durumu)
  if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/40"
            >
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 📭 Adres yoksa
  if (addresses.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
          <FiMapPin size={22} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Kayıtlı Adresiniz Bulunmuyor
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Siparişinizi tamamlayabilmek için lütfen teslimat adresi ekleyin.
        </p>
        <div className="pt-2">
          <Link
            href="/account/addresses/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-xs shadow-md shadow-pink-500/20 transition-all"
          >
            <FiPlus size={16} /> Yeni Adres Ekle
          </Link>
        </div>
      </div>
    );
  }

  // 📦 Adresler varsa
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiMapPin className="text-pink-600" /> Teslimat Adresi Seçin
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Siparişinizin gönderileceği adresi seçerek devam edin.
        </p>
      </div>

      <div className="space-y-3">
        {addresses.map((a) => {
          const isSelected = selectedAddress === a.id;
          return (
            <div
              key={a.id}
              onClick={() => setSelectedAddress(a.id)}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-pink-500 bg-pink-50/40 dark:bg-pink-950/20 shadow-sm"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-pink-300 dark:hover:border-gray-700"
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => setSelectedAddress(a.id)}
                  className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500 cursor-pointer"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    <FiHome className="text-pink-600" /> {a.title || "Teslimat Adresi"}
                  </span>
                  {a.isDefault && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
                      Varsayılan
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {a.fullName} <span className="text-gray-400 font-normal">({a.phone})</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {a.address1}, {a.neighbourhood ? `${a.neighbourhood} Mah.` : ""} {a.district} / {a.city} {a.zip ? `- ${a.zip}` : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/account/addresses/new"
          className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline"
        >
          <FiPlus size={14} /> Yeni Adres Ekle
        </Link>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
        >
          Sonraki Adım <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}