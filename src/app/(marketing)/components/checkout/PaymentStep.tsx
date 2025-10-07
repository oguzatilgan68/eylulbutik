"use client";

import React from "react";

interface Props {
  orderData: any;
  nextStep: () => void;
}

export default function PaymentStep({ orderData, nextStep }: Props) {
  const handlePayment = async () => {
    try {
      // Backend'de /api/paytr/init route'u oluşturacağız
      const res = await fetch("/api/paytr/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        // PayTR ödeme sayfasına yönlendirme
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.paytr.com/odeme/api/get-token"; // Test için doğru endpoint
        form.target = "_self";

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token";
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Ödeme başlatılamadı: " + (data.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası, tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Ödeme Adımı
      </h2>
      <p className="mb-4">
        Ödeme yapmak için aşağıdaki butona tıklayın, PayTR test sayfasına
        yönlendirileceksiniz.
      </p>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Ödeme Yap
      </button>
    </div>
  );
}
