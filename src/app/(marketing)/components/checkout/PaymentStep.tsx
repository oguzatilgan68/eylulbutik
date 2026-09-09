"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiCreditCard, FiDollarSign, FiArrowRight, FiCheck, FiShield } from "react-icons/fi";
import { useUser } from "../../context/userContext";

interface Props {
  orderData: any;
  setOrderData: (data: any) => void; // 👈 Burayı ekledik birtanem!
  nextStep: () => void;
  prevStep?: () => void;
}

// Banka Hesap Bilgileriniz
const BANK_ACCOUNTS = [
  {
    bankName: "Garanti BBVA",
    accountHolder: "Eylül Butik Tekstil San. Tic. Ltd. Şti.",
    iban: "TR33 0006 2000 1234 5678 9012 34",
  },
  {
    bankName: "Ziraat Bankası",
    accountHolder: "Eylül Butik Tekstil San. Tic. Ltd. Şti.",
    iban: "TR54 0001 0001 2345 6789 0123 45",
  },
];

export default function PaymentStep({ orderData, setOrderData, nextStep, prevStep }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"paytr" | "eft">("paytr");
  
  // EFT Bildirim Formu State'leri
  const [showEftForm, setShowEftForm] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [bankName, setBankName] = useState(BANK_ACCOUNTS[0].bankName);
  const [eftNote, setEftNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  // PayTR ile Ödeme
  const handlePayTR = async () => {
    try {
      const res = await fetch("/api/paytr/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.paytr.com/odeme/api";
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

  // EFT / Havale Bildirimi Gönderme
const handleEftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      alert("Lütfen gönderici adını ve soyadını girin.");
      return;
    }

    setLoading(true);
    try {
      let currentOrderId = orderData?.id || orderData?.orderId;
      
      // Artık yukarıda tanımladığımız 'user' değişkenini doğrudan kullanabiliriz!
      if (!currentOrderId) {
          const orderRes = await fetch("/api/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...orderData,
              userId: orderData.userId || user?.id || "", 
            }),
          });
        const orderResult = await orderRes.json();
        
        if (!orderRes.ok || !orderResult.orderId) {
          throw new Error(orderResult.error || "Sipariş oluşturulamadı.");
        }
        currentOrderId = orderResult.orderId;
        
        setOrderData({ ...orderData, id: currentOrderId });
      }

      const res = await fetch("/api/bank-transfer/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: currentOrderId,
          senderName,
          bankName,
          amount: Number(orderData.total || 0),
          note: eftNote,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("EFT/Havale bildiriminiz başarıyla alındı! Siparişiniz onay bekliyor.");
        nextStep();
      } else {
        alert("Bildirim gönderilemedi: " + (data.error || "Bilinmeyen hata"));
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Sunucu hatası, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiCreditCard className="text-pink-600" /> Ödeme Yöntemi Seçin
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Size en uygun ödeme yöntemini seçerek siparişinizi tamamlayın.
        </p>
      </div>

      {/* Ödeme Yöntemi Sekmeleri */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => { setPaymentMethod("paytr"); setShowEftForm(false); }}
          className={`py-4 px-5 rounded-2xl font-semibold border text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            paymentMethod === "paytr"
              ? "border-pink-500 bg-pink-50/60 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 shadow-sm"
              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300"
          }`}
        >
          <FiCreditCard size={18} /> Kredi Kartı (PayTR)
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("eft")}
          className={`py-4 px-5 rounded-2xl font-semibold border text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            paymentMethod === "eft"
              ? "border-pink-500 bg-pink-50/60 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 shadow-sm"
              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300"
          }`}
        >
          <FiDollarSign size={18} /> EFT / Havale
        </button>
      </div>

      {/* 1. PayTR Alanı */}
      {paymentMethod === "paytr" && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <FiShield className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
              256-bit SSL sertifikalı güvenli altyapı ile kredi veya banka kartınızla anında ödeme yapın.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePayTR}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            PayTR ile Güvenli Öde <FiArrowRight size={16} />
          </button>
        </div>
      )}

      {/* 2. EFT / Havale Alanı */}
      {paymentMethod === "eft" && (
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Banka Hesap Bilgilerimiz</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BANK_ACCOUNTS.map((bank, index) => (
                <div key={index} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
                  <p className="font-bold text-xs text-pink-600 dark:text-pink-400">{bank.bankName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Alıcı: {bank.accountHolder}</p>
                  <p className="font-mono text-xs bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700 select-all text-gray-900 dark:text-gray-100 mt-1 font-semibold">
                    {bank.iban}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {!showEftForm ? (
            <button
              type="button"
              onClick={() => setShowEftForm(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
            >
              Havale / EFT Yaptım, Bildirim Yapacağım <FiArrowRight size={16} />
            </button>
          ) : (
            <form onSubmit={handleEftSubmit} className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-5">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Ödeme Bildirim Formu</h4>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Göndericinin Adı Soyadı (Hesap Sahibi) *
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Örn: Ayşe Yılmaz"
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Gönderilen Banka *
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={inputClass}
                >
                  {BANK_ACCOUNTS.map((b, idx) => (
                    <option key={idx} value={b.bankName}>
                      {b.bankName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Ek Not / Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={eftNote}
                  onChange={(e) => setEftNote(e.target.value)}
                  placeholder="Örn: X şubesinden gönderildi."
                  className={`${inputClass} min-h-20 resize-y`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEftForm(false)}
                  className="w-1/3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 text-xs font-medium transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FiCheck size={16} />
                  {loading ? "Gönderiliyor..." : "Bildirimi Tamamla"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Geri Butonu */}
      <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        {prevStep && (
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ← Geri
          </button>
        )}
      </div>
    </div>
  );
}