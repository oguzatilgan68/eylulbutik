"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

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

interface CouponResponse {
  data: Coupon[];
  meta: { total: number };
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
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Kuponlar yüklenemedi");
      const json = await res.json();

      setCoupons(json.data); // ✅ sadece array olan kısmı al
      setTotal(json.meta.total); // ✅ toplam sayfa için meta.total
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
        startsAt: coupon.startsAt || "",
        endsAt: coupon.endsAt || "",
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

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">İndirim Kuponları</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Yeni Kupon
        </button>
      </div>

      {/* Kupon Listesi */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border">Kod</th>
              <th className="p-2 border">Tür</th>
              <th className="p-2 border">Değer</th>
              <th className="p-2 border">Geçerlilik</th>
              <th className="p-2 border">Kullanım</th>
              <th className="p-2 border">Durum</th>
              <th className="p-2 border">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-2 border font-mono">{c.code}</td>
                <td className="p-2 border">{c.type}</td>
                <td className="p-2 border">
                  {c.type === "PERCENT" ? `%${c.value}` : `${c.value}₺`}
                </td>
                <td className="p-2 border">
                  {c.startsAt ? new Date(c.startsAt).toLocaleDateString() : "-"}{" "}
                  - {c.endsAt ? new Date(c.endsAt).toLocaleDateString() : "-"}
                </td>
                <td className="p-2 border">
                  {c.usedCount} / {c.maxUses || "∞"}
                </td>
                <td className="p-2 border">
                  <span
                    className={clsx(
                      "px-2 py-1 rounded text-xs",
                      c.isActive
                        ? "bg-green-600 text-white"
                        : "bg-gray-400 text-white"
                    )}
                  >
                    {c.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => openModal(c)}
                    className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Hiç kupon yok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Kupon Düzenle" : "Yeni Kupon"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Kod"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
                required
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
              >
                <option value="PERCENT">Yüzde</option>
                <option value="FIXED">Sabit Tutar</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Değer"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
                required
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={form.startsAt}
                  onChange={(e) =>
                    setForm({ ...form, startsAt: e.target.value })
                  }
                  className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-800"
                />
                <input
                  type="date"
                  value={form.endsAt}
                  onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                  className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <input
                type="number"
                placeholder="Maksimum Kullanım"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                Aktif mi?
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
