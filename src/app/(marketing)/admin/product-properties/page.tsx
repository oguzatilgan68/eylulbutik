"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
}

interface PropertyType {
  id: string;
  name: string;
}

interface ProductProperty {
  id: string;
  value: string;
  product: Product;
  propertyType: PropertyType;
}

export default function ProductPropertiesPage() {
  const [properties, setProperties] = useState<ProductProperty[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [form, setForm] = useState({
    propertyTypeId: "",
    value: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load property types + product properties
  useEffect(() => {
    fetch("/api/product-properties")
      .then((res) => res.json())
      .then(setProperties);

    fetch("/api/global-properties") // property tiplerini de çekelim
      .then((res) => res.json())
      .then(setPropertyTypes);
  }, []);

  const handleSubmit = async () => {
    if (!form.propertyTypeId || !form.value) return;

    if (editingId) {
      const res = await fetch(`/api/product-properties/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setProperties((props) =>
        props.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingId(null);
    } else {
      const res = await fetch("/api/product-properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newProp = await res.json();
      setProperties([...properties, newProp]);
    }

    setForm({ propertyTypeId: "", value: "" });
  };

  const handleEdit = (prop: ProductProperty) => {
    setEditingId(prop.id);
    setForm({
      propertyTypeId: prop.propertyType.id,
      value: prop.value,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await fetch(`/api/product-properties/${id}`, { method: "DELETE" });
    setProperties((props) => props.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Ürün Özellikleri</h1>

      {/* Form */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6 flex flex-col gap-4">
        <Select
          value={form.propertyTypeId}
          onValueChange={(val) => setForm({ ...form, propertyTypeId: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Özellik Türü Seç (örn. Renk, Yaka Tipi)" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((pt) => (
              <SelectItem key={pt.id} value={pt.id}>
                {pt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Değer (örn. Krem, Regular Fit)"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <Button
          onClick={handleSubmit}
          className="bg-blue-500 text-white w-1/2 mx-auto hover:bg-blue-700"
        >
          {editingId ? "Güncelle" : "Ekle"}
        </Button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col gap-2 shadow"
          >
            <div>
              <span className="font-medium">Özellik:</span>{" "}
              {p.propertyType.name}
            </div>
            <div>
              <span className="font-medium">Değer:</span> {p.value}
            </div>
            <div className="flex gap-2 mt-2">
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
