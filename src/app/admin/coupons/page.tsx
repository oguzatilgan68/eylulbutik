"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiPercent, FiDollarSign } from "react-icons/fi";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  startsAt?: string;
  endsAt?: string;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
}

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "0",
    startsAt: "",
    endsAt: "",
    maxUses: "",
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Kuponlar yüklenemedi");
      const json = await res.json();

      setCoupons(json.data || []);
      setTotal(json.meta?.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/admin/coupons?id=${editing.id}`
        : "/api/admin/coupons";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: parseFloat(form.value),
          maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
        }),
      });

      if (!res.ok) throw new Error("Kupon kaydedilemedi");
      setModalOpen(false);
      setEditing(null);
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız");
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditing(coupon);
      setForm({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        startsAt: coupon.startsAt ? coupon.startsAt.split("T")[0] : "",
        endsAt: coupon.endsAt ? coupon.endsAt.split("T")[0] : "",
        maxUses: coupon.maxUses?.toString() || "",
        isActive: coupon.isActive,
      });
    } else {
      setEditing(null);
      setForm({
        code: "",
        type: "PERCENT",
        value: "0",
        startsAt: "",
        endsAt: "",
        maxUses: "",
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  if (loading && coupons.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
          <span>Kuponlar yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-rose-500 font-semibold p-4">Hata: {error}</p>;

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Yeni Kupon Ekle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiTag className="text-pink-600" /> İndirim Kuponları Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Müşterilerinize özel kampanya kuponları oluşturun ve kullanım limitlerini takip edin.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium shadow-md shadow-pink-500/20 transition-all cursor-pointer"
        >
          <FiPlus size={18} /> Yeni Kupon Ekle
        </button>
      </div>

      {/* Tablo Alanı */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[750px]">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5">Kupon Kodu</th>
                <th className="px-6 py-3.5">Tür</th>
                <th className="px-6 py-3.5">Değer</th>
                <th className="px-6 py-3.5">Geçerlilik Tarihi</th>
                <th className="px-6 py-3.5">Kullanım</th>
                <th className="px-6 py-3.5">Durum</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs bg-pink-50/50 dark:bg-gray-800/50 rounded-lg">
                      {c.code}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {c.type === "PERCENT" ? <FiPercent size={12} className="text-pink-600" /> : <FiDollarSign size={12} className="text-pink-600" />}
                        {c.type === "PERCENT" ? "Yüzde İndirim" : "Sabit Tutar"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {c.type === "PERCENT" ? `%${c.value}` : `${c.value} ₺`}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {c.startsAt ? new Date(c.startsAt).toLocaleDateString("tr-TR") : "-"} 
                      {" → "} 
                      {c.endsAt ? new Date(c.endsAt).toLocaleDateString("tr-TR") : "Süresiz"}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {c.usedCount} / {c.maxUses || "∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "px-2.5 py-1 rounded-full text-xs font-semibold",
                          c.isActive
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        )}
                      >
                        {c.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(c)}
                          className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <FiEdit2 size={13} /> Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <FiTrash2 size={13} /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Henüz kupon oluşturulmamış.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editing ? "Kuponu Düzenle" : "Yeni İndirim Kuponu"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Kupon Kodu *
                </label>
                <input
                  type="text"
                  placeholder="Örn: EYLUL2026"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    İndirim Türü
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputClass}
                  >
                    <option value="PERCENT">Yüzde (%)</option>
                    <option value="FIXED">Sabit Tutar (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Değer *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={form.startsAt}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={form.endsAt}
                    onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Maksimum Kullanım Limiti
                </label>
                <input
                  type="number"
                  placeholder="Boş bırakılırsa sınırsız olur"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:border-pink-500 transition-all">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Kupon Aktif (Kullanıma açık)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                >
                  <FiCheck size={16} /> Kuponu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}