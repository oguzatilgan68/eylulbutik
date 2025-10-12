"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GlobalProperty {
  id: string;
  name: string;
}

export default function GlobalPropertiesPage() {
  const [props, setProps] = useState<GlobalProperty[]>([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Listeyi yükle
  useEffect(() => {
    fetch("/api/admin/global-properties")
      .then((res) => res.json())
      .then(setProps)
      .catch((err) => console.error("Liste yüklenirken hata:", err));
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    try {
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
    }
  };

  const handleEdit = (prop: GlobalProperty) => {
    setEditingId(prop.id);
    setForm({ name: prop.name });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    try {
      const res = await fetch(`/api/admin/global-properties/${id}`, {
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
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Global Özellikler
      </h1>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-6 shadow-md flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Input
          className="flex-1"
          placeholder="Özellik Adı (örn: Renk)"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
        />
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto"
        >
          {editingId ? "Güncelle" : "Ekle"}
        </Button>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {props.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow flex justify-between items-center transition-colors"
          >
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {p.name}
            </span>
            <div className="flex gap-2 ml-2">
              <Button
                size="sm"
                variant="outline"
                className="dark:border-gray-600 dark:text-gray-200"
                onClick={() => handleEdit(p)}
              >
                Düzenle
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(p.id)}
              >
                Sil
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
