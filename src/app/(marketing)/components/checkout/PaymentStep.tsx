"use client";

import React, { useState } from "react";

interface Props {
  orderData: any;
  setOrderData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function PaymentStep({
  orderData,
  setOrderData,
  nextStep,
  prevStep,
}: Props) {
  const [fullName, setfullName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handlePayment = () => {
    // TODO: backend ödeme işlemi
    setOrderData({ ...orderData, payment: { cardNumber, expiry, cvc } });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Ödeme Bilgileri
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Kart Sahibi Adı"
          value={fullName}
          onChange={(e) => setfullName(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Kart Numarası"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Son Kullanma"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Geri
        </button>
        <button
          onClick={handlePayment}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Ödeme Yap
        </button>
      </div>
    </div>
  );
}
