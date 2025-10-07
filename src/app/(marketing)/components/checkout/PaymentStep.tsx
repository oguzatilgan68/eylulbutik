"use client";

import React from "react";

interface Props {
  orderData: any;
  nextStep: () => void;
  prevStep?: () => void; // ✅ opsiyonel hale getirdik
}

export default function PaymentStep({ orderData, nextStep, prevStep }: Props) {
  const handlePayment = async () => {
    try {
      const res = await fetch("/api/paytr/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        // ✅ PayTR yönlendirmesi için doğru form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.paytr.com/odeme/api"; // ✅ token alınan endpoint değil, ödeme yönlendirme endpoint'i
        form.target = "_self";

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token";
        input.value = data.token;
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Ödeme başlatılamadı: " + (data.error || "Bilinmeyen hata"));
      }
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Ödeme Adımı
      </h2>

      <p className="mb-4">
        Ödeme yapmak için aşağıdaki butona tıklayın. PayTR ödeme sayfasına
        yönlendirileceksiniz.
      </p>

      <div className="flex justify-between">
        {prevStep && (
          <button
            onClick={prevStep}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Geri
          </button>
        )}

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
