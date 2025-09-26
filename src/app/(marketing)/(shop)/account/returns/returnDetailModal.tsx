"use client";

import React, { useState } from "react";

function ReturnDetailModal({
  request,
  onClose,
}: {
  request: any;
  onClose: () => void;
}) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">İade Detayı</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Durum:</span>{" "}
            {request.status === "PENDING"
              ? "Beklemede"
              : request.status === "APPROVED"
              ? "Onaylandı"
              : request.status === "REJECTED"
              ? "Reddedildi"
              : request.status}
          </p>
          <p>
            <span className="font-medium">Sipariş Id:</span> {request.orderId}
          </p>
          <p>
            <span className="font-medium">Oluşturulma:</span>{" "}
            {new Date(request.createdAt).toLocaleDateString("tr-TR")}
          </p>
          <div>
            <span className="font-medium">Ürünler:</span>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {request.items.map((item: any) => (
                <li key={item.id}>
                  {item.orderItem.name} — {item.qty} adet
                </li>
              ))}
            </ul>
          </div>
          {request.comment && (
            <p>
              <span className="font-medium">Açıklama:</span> {request.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReturnsList({ returns }: { returns: any[] }) {
  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 dark:text-white">
        İade Taleplerim
      </h1>
      <ul className="mt-6 space-y-4">
        {returns.map((r) => (
          <li
            key={r.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="font-medium dark:text-gray-100">
                  İade Talebi
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Durum:{" "}
                  {r.status === "PENDING"
                    ? "Beklemede"
                    : r.status === "APPROVED"
                    ? "Onaylandı"
                    : r.status === "REJECTED"
                    ? "Reddedildi"
                    : r.status}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  İade Tarih:{" "}
                  {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                </div>
              </div>
              <button
                onClick={() => setSelected(r)}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Detay
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <ReturnDetailModal
          request={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
