"use client";

import React from "react";

interface Props {
  cartItems: any[];
  discount?: number;
}

export default function OrderSummary({ cartItems, discount = 0 }: Props) {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.qty,
    0
  );
  const total = subtotal - discount;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-2">
      <h3 className="text-lg font-semibold dark:text-white">Sipariş Özeti</h3>
      {cartItems.map((item: any) => (
        <div key={item.id} className="flex justify-between">
          <span className="dark:text-gray-200">{item.product.name}</span>
          <span className="dark:text-gray-200">
            {(item.unitPrice * item.qty).toFixed(2)} TL
          </span>
        </div>
      ))}
      <hr className="border-gray-300 dark:border-gray-700" />
      {discount > 0 && <p>İndirim: -{discount.toFixed(2)} TL</p>}
      <p className="font-semibold">Toplam: {total.toFixed(2)} TL</p>
    </div>
  );
}
