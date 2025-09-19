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
  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [showBack, setShowBack] = useState(false);

  const handleNext = () => {
    if (!fullName || !cardNumber || !expiry || !cvc) {
      alert("Kart bilgilerini eksiksiz girin!");
      return;
    }

    setOrderData((prev: any) => ({
      ...prev,
      payment: { fullName, cardNumber, expiry, cvc },
    }));

    nextStep(); // step 3'e geçiş
  };

  const handleCardNumberChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(onlyNumbers.replace(/(.{4})/g, "$1 ").trim());
  };

  const handleExpiryChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 4);
    setExpiry(onlyNumbers.replace(/(.{2})/, "$1/").slice(0, 5));
  };

  const handleCvcChange = (value: string) => {
    setCvc(value.replace(/\D/g, "").slice(0, 3));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Ödeme Bilgileri
      </h2>

      <div className="relative w-full h-48 perspective">
        <div
          className={`w-full h-full rounded-xl shadow-lg duration-500 transform-style-3d ${
            showBack ? "rotate-y-180" : ""
          }`}
        >
          <div className="absolute w-full h-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 backface-hidden flex flex-col justify-between">
            <div className="text-sm">Kart Sahibi</div>
            <div className="text-lg font-mono tracking-widest">
              {cardNumber || "#### #### #### ####"}
            </div>
            <div className="flex justify-between">
              <span>{fullName || "İSİM SOYİSİM"}</span>
              <span>{expiry || "AY/YIL"}</span>
            </div>
          </div>

          <div className="absolute w-full h-full rounded-xl bg-gray-800 text-white p-4 backface-hidden rotate-y-180 flex flex-col justify-center items-end text-lg font-mono">
            CVC: {cvc || "###"}
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-3">
        <input
          type="text"
          placeholder="Kart Sahibi Adı"
          value={fullName}
          onChange={(e) => setFullName(e.target.value.toUpperCase())}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Kart Numarası"
          value={cardNumber}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white font-mono tracking-widest"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Ay/Yıl"
            value={expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onFocus={() => setShowBack(true)}
            onBlur={() => setShowBack(false)}
            onChange={(e) => handleCvcChange(e.target.value)}
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
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Ödeme Yap
        </button>
      </div>
    </div>
  );
}
