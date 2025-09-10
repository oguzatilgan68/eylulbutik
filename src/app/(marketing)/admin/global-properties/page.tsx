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

  // 🟢 Listele
  useEffect(() => {
    fetch("/api/global-properties")
      .then((res) => res.json())
      .then(setProps);
  }, []);

  const handleSubmit = async () => {
    if (!form.name) return;

    if (editingId) {
      const res = await fetch(`/api/global-properties/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setProps((all) => all.map((p) => (p.id === updated.id ? updated : p)));
      setEditingId(null);
    } else {
      const res = await fetch("/api/global-properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newProp = await res.json();
      setProps([...props, newProp]);
    }

    setForm({ name: "" });
  };

  const handleEdit = (prop: GlobalProperty) => {
    setEditingId(prop.id);
    setForm({ name: prop.name });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await fetch(`/api/global-properties/${id}`, { method: "DELETE" });
    setProps((all) => all.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Global Özellikler</h1>

      {/* Form */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6 flex gap-4">
        <Input
          placeholder="Özellik Adı (örn: Renk)"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value.trim() })}
        />
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          {editingId ? "Güncelle" : "Ekle"}
        </Button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {props.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow flex justify-between items-center"
          >
            <span>{p.name}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
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
