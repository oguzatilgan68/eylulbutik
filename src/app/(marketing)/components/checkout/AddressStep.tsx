"use client";

import React, { useState, useEffect } from "react";
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
  const { user } = useUser();

  useEffect(() => {
    // Kullanıcı yoksa istek atma
    if (!user?.id) return;

    const getUserAddresses = async () => {
      try {
        const res = await fetch("/api/address");
        if (!res.ok) throw new Error("Adresler alınamadı");
        const data = await res.json();
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("Adresler alınamadı:", err);
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Adres Bilgileri
      </h2>
      <div className="space-y-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-3 p-3 border rounded cursor-pointer ${
              selectedAddress === a.id
                ? "border-blue-600"
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
