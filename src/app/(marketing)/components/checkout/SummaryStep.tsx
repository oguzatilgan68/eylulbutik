"use client";

import React from "react";

interface Props {
  orderData: any;
}

export default function SummaryStep({ orderData }: Props) {
  const success = true; // TODO: backend cevabı

  return (
    <div className="text-center">
      {success ? (
        <>
          <h2 className="text-2xl font-bold dark:text-white">
            Ödeme Başarılı!
          </h2>
          <p className="mt-2 dark:text-gray-300">
            Siparişiniz alındı ve hazırlanıyor.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-red-500">Ödeme Başarısız!</h2>
          <p className="mt-2 dark:text-gray-300">
            Kartınız reddedildi, lütfen tekrar deneyin.
          </p>
        </>
      )}
    </div>
  );
}
