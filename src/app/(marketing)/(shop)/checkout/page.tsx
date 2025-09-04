"use client";

import React, { useEffect, useState } from "react";
import AddressStep from "../../components/checkout/AddressStep";
import PaymentStep from "../../components/checkout/PaymentStep";
import OrderSummary from "../../components/checkout/OrderSummary";
import SummaryStep from "../../components/checkout/SummaryStep";

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Adres, 2: Ödeme, 3: Özet
  const [cartItems, setCartItems] = useState<any[]>([]); // Sepet verisi fetch ile gelmeli
  const [orderData, setOrderData] = useState<any>({}); // Adres & ödeme verisi
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const getCartItems = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItems(data.items);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getCartItems();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Ödeme</h1>

      {/* Adım göstergesi */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white ${
                step === s ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-700"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 bg-gray-400 dark:bg-gray-700 mt-1 ${
                  step > s ? "bg-blue-600" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol: Adım Formu */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {step === 1 && (
            <AddressStep
              orderData={orderData}
              setOrderData={setOrderData}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <PaymentStep
              orderData={orderData}
              setOrderData={setOrderData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && <SummaryStep orderData={orderData} />}
        </div>

        {/* Sağ: Sipariş Özeti */}
        <div className="w-full lg:w-1/3">
          <OrderSummary cartItems={cartItems} discount={0} />
        </div>
      </div>
    </div>
  );
}
