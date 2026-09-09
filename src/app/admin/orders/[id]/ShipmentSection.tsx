"use client";

import { ShipmentModal, STATUSES } from "@/app/(marketing)/components/shipment/shipmentModal";
import React, { useState } from "react";
import { FiTruck, FiPlus, FiEdit3 } from "react-icons/fi";

export function ShipmentSection({ orderId, shipment }: any) {
  const [modalOpen, setModalOpen] = useState(false);

  const currentStatusObj = STATUSES.find((s) => s.value === shipment?.status);
  const currentStatusLabel = currentStatusObj?.label || shipment?.status;
  const statusBadgeClass = currentStatusObj?.color || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex items-center gap-2">
          <FiTruck className="text-pink-600" /> Kargo & Lojistik Takibi
        </span>
        {shipment && (
          <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${statusBadgeClass}`}>
            {currentStatusLabel}
          </span>
        )}
      </h2>

      {shipment ? (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Kargo Firması</span>
              <span className="font-bold text-gray-900 dark:text-white text-base">
                {shipment.provider.replace("_", " ")}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Takip Numarası</span>
              <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-sm tracking-wide">
                {shipment.trackingNo || "Belirtilmedi"}
              </span>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold transition-all cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <FiEdit3 size={15} /> Kargo Bilgisini Düzenle
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-6">
          <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
            <FiTruck size={22} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Henüz Kargo Kaydı Yok</p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Bu sipariş için kargo firması atayarak takip numarası oluşturun.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all cursor-pointer"
            >
              <FiPlus size={16} /> Gönderi Ekle & Kargo Oluştur
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <ShipmentModal
          initial={shipment ? shipment : { orderId }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}