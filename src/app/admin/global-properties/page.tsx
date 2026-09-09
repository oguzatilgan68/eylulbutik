"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiSliders, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

interface GlobalProperty {
  id: string;
  name: string;
}

export default function GlobalPropertiesPage() {
  const [props, setProps] = useState<GlobalProperty[]>([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Listeyi yükle
  useEffect(() => {
    fetch("/api/admin/product-properties")
      .then((res) => res.json())
      .then(setProps)
      .catch((err) => console.error("Liste yüklenirken hata:", err));
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    try {
      setLoading(true);
      if (editingId) {
        const res = await fetch(`/api/admin/global-properties/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.error || "Güncelleme başarısız");
        setProps((all) => all.map((p) => (p.id === updated.id ? updated : p)));
        setEditingId(null);
      } else {
        const res = await fetch("/api/admin/global-properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const newProp = await res.json();
        if (!res.ok) throw new Error(newProp.error || "Ekleme başarısız");
        setProps((all) => [...all, newProp]);
      }
      setForm({ name: "" });
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prop: GlobalProperty) => {
    setEditingId(prop.id);
    setForm({ name: prop.name });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu özelliği silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/product-properties/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız");
      setProps((all) => all.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiSliders className="text-pink-600" /> Global Ürün Özellikleri
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Ürünlere tanımlanabilecek ana özellik başlıklarını (Örn: Renk, Beden, Kumaş) yönetin.
        </p>
      </div>

      {/* Form Alanı */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <Input
          className="w-full sm:flex-1 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm py-2.5"
          placeholder="Özellik Adı (örn: Renk, Materyal)"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
        />
        <div className="flex w-full sm:w-auto gap-2">
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "" });
              }}
              className="rounded-xl px-4 text-sm"
            >
              <FiX size={16} />
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 text-sm shadow-md shadow-pink-500/20"
          >
            {editingId ? <><FiCheck size={16} className="mr-1.5" /> Güncelle</> : <><FiPlus size={16} className="mr-1.5" /> Özellik Ekle</>}
          </Button>
        </div>
      </div>

      {/* Liste Grid */}
      {props.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {props.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition-all hover:border-pink-500/50"
            >
              <span className="text-gray-900 dark:text-white font-semibold text-sm">
                {p.name}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg"
                  onClick={() => handleEdit(p)}
                >
                  <FiEdit2 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg"
                  onClick={() => handleDelete(p.id)}
                >
                  <FiTrash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Henüz global özellik eklenmemiş.
          </p>
        </div>
      )}
    </div>
  );
}