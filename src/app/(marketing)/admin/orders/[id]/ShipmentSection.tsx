"use client";

import {
  ShipmentModal,
  STATUSES,
} from "@/app/(marketing)/components/shipment/shipmentModal";
import React, { useState } from "react";

export function ShipmentSection({ orderId, shipment }: any) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section>
      <h2 className="text-xl font-semibold dark:text-white mb-2">
        Kargo Bilgileri
      </h2>

      {shipment ? (
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <p className="dark:text-gray-200">Firma: {shipment.provider}</p>
          <p className="dark:text-gray-200">Takip No: {shipment.trackingNo}</p>
          <p className="dark:text-gray-200">
            Durum: {STATUSES.find((s) => s.value === shipment.status)?.label}
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-3 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
          >
            Düzenle
          </button>
        </div>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
        >
          Gönderi Ekle
        </button>
      )}

      {modalOpen && (
        <ShipmentModal
          initial={shipment ? shipment : { orderId }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
