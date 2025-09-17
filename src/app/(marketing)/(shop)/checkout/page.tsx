"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddressStep from "../../components/checkout/AddressStep";
import PaymentStep from "../../components/checkout/PaymentStep";
import SummaryStep from "../../components/checkout/SummaryStep";
import OrderSummary from "../../components/ui/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Adres, 2: Ödeme, 3: Özet
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<any>({});
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const getCartItems = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItems(data.items);

      // Ara toplam hesapla
      const total = data.items.reduce(
        (acc: number, item: any) => acc + item.unitPrice * item.qty,
        0
      );
      setSubtotal(total);
      setFinalTotal(total - discount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);
  // Ara toplam ve final toplam otomatik güncellensin
  useEffect(() => {
    const total = cartItems.reduce(
      (acc: number, item: any) => acc + item.unitPrice * item.qty,
      0
    );
    setSubtotal(total);
    setFinalTotal(Math.max(0, total - discount)); // kupon ile otomatik hesap
  }, [cartItems, discount]);

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
                className={`h-1 mt-1 ${
                  step > s ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-700"
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
          <OrderSummary
            subtotal={subtotal}
            initialDiscount={discount}
            onApply={(d, f) => {
              setDiscount(d);
              setFinalTotal(f);
            }}
            onCheckout={() => router.push("/checkout")}
          />
        </div>
      </div>
    </div>
  );
}
