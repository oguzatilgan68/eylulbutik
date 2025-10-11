"use client";

import { useEffect, useState } from "react";
import AddressStep from "../../components/checkout/AddressStep";
import PaymentStep from "../../components/checkout/PaymentStep";
import SummaryStep from "../../components/checkout/SummaryStep";
import OrderSummary from "../../components/ui/OrderSummary";

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Adres, 2: Ödeme, 3: Özet
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<any>({});
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "SUCCEEDED" | "FAILED"
  >("PENDING");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Sepeti çek
  const getCartItems = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItems(data.items);
      const total = data.items.reduce(
        (acc: number, item: any) => acc + item.unitPrice * item.qty,
        0
      );
      setSubtotal(total);
      setFinalTotal(total - discount);
      setOrderData((prev: any) => ({
        ...prev,
        basketItems: data.items.map((item: any) => ({
          id: item.product?.id,
          name: item.name,
          variantId: item.product?.variant?.id,
          unitPrice: item.unitPrice,
          qty: item.qty,
        })),
        subtotal: total,
        discount,
        total: total - discount,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc: number, item: any) => acc + item.unitPrice * item.qty,
      0
    );
    setSubtotal(total);
    setFinalTotal(Math.max(0, total - discount));

    setOrderData((prev: any) => ({
      ...prev,
      subtotal: total,
      discount,
      total: Math.max(0, total - discount),
      basketItems: cartItems.map((item: any) => ({
        id: item.product?.id,
        name: item.product?.name, // ✅ product name
        unitPrice: item.unitPrice,
        qty: item.qty,
      })),
    }));
  }, [cartItems, discount]);

  // 💳 Ödeme işlemi, step 3'e geçildiğinde tetiklenecek
  useEffect(() => {
    if (!orderData?.payment?.merchantOid) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/paytr/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchantOid: orderData.payment.merchantOid }),
        });
        const data = await res.json();

        if (data.status === "SUCCEEDED") {
          setPaymentStatus("SUCCEEDED");
          setStep(3); // otomatik olarak Step3
          clearInterval(interval);
        } else if (data.status === "FAILED") {
          setPaymentStatus("FAILED");
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderData.payment?.merchantOid]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Ödeme</h1>

      {/* Adım göstergesi */}
      <div className="relative mb-8 h-2 bg-gray-400 dark:bg-gray-700 rounded-full">
        <div
          className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{
            width: `${(step / 3) * 100}%`, // 1.adımda %33, 2.adımda %66, 3.adımda %100
          }}
        />
        <div className="flex justify-between absolute top-0 left-0 w-full -mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center w-1/3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  step >= s ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-700"
                }`}
              >
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {step === 1 && (
            <AddressStep
              orderData={orderData}
              setOrderData={(data) =>
                setOrderData({
                  ...data,
                  basketItems: cartItems.map((item) => ({
                    id: item.product?.id,
                    name: item.name,
                    unitPrice: item.unitPrice,
                    qty: item.qty,
                  })),
                  subtotal,
                  discount,
                  total: finalTotal,
                })
              }
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <PaymentStep
              orderData={orderData}
              prevStep={prevStep}
              nextStep={nextStep} // sadece step’i ilerletiyoruz
            />
          )}
          {paymentStatus === "FAILED" && step === 3 && (
            <div className="text-red-600 font-semibold mt-6">
              Ödeme başarısız oldu. Lütfen tekrar deneyin.
            </div>
          )}
          {step === 3 && <SummaryStep orderData={orderData} />}
        </div>

        <div className="w-full lg:w-1/3">
          <OrderSummary
            subtotal={subtotal}
            onApply={(d, f) => {
              setDiscount(d);
              setFinalTotal(f);
              setOrderData((prev: any) => ({ ...prev, discount: d, total: f }));
            }}
            showCheckoutButton={false}
          />
        </div>
      </div>
    </div>
  );
}
