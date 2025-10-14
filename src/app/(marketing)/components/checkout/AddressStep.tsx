"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../../context/userContext";

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
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 🌀 loading state
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const getUserAddresses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/address");
        if (!res.ok) throw new Error("Adresler alınamadı");
        const data = await res.json();
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("Adresler alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    getUserAddresses();
  }, [user?.id]);

  if (!user) {
    return <div>Lütfen giriş yapın.</div>;
  }

  const handleNext = () => {
    if (!selectedAddress) {
      alert("Bir adres seçin");
      return;
    }
    setOrderData({ ...orderData, addressId: selectedAddress });
    nextStep();
  };

  // 🦴 Skeleton UI (yükleniyor durumu)
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded"
            >
              <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-3 w-64 bg-gray-200 dark:bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded mt-6" />
      </div>
    );
  }

  // 📭 Adres yoksa
  if (addresses.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Adres Bilgileri
        </h2>
        <div className="p-4 border rounded-md text-center dark:text-gray-200">
          <p>Henüz kayıtlı adresiniz bulunmuyor.</p>
          <Link
            href="/account/addresses/new" // 💡 href’i sen düzenleyebilirsin
            className="inline-block mt-3 text-blue-600 hover:underline font-medium"
          >
            + Yeni adres ekle
          </Link>
        </div>
      </div>
    );
  }

  // 📦 Adresler varsa
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Adres Bilgileri
      </h2>

      <div className="space-y-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition ${
              selectedAddress === a.id
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "hover:border-blue-600"
            }`}
            onClick={() => setSelectedAddress(a.id)}
          >
            <input
              type="radio"
              checked={selectedAddress === a.id}
              readOnly
              className="cursor-pointer"
            />
            <div>
              <p className="font-semibold dark:text-white">{a.title}</p>
              <p className="text-gray-500 dark:text-gray-300">
                {a.city} {a.district} {a.neighbourhood} {a.address1}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Sonraki Adım
      </button>
    </div>
  );
}
