"use client";

import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    // TODO: fetch user's saved addresses
    setAddresses([
      { id: "1", label: "Ev Adresi", details: "İstanbul, Türkiye" },
      { id: "2", label: "İş Adresi", details: "Ankara, Türkiye" },
    ]);
  }, []);

  const handleNext = () => {
    if (!selectedAddress) return alert("Bir adres seçin");
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
            className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-blue-600"
            onClick={() => setSelectedAddress(a.id)}
          >
            <input
              type="radio"
              checked={selectedAddress === a.id}
              readOnly
              className="cursor-pointer"
            />
            <div>
              <p className="font-semibold dark:text-white">{a.label}</p>
              <p className="text-gray-500 dark:text-gray-300">{a.details}</p>
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
