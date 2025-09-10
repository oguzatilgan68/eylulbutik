"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
}

interface ProductProperty {
  id: string;
  productId: string;
  name: string;
  value: string;
}

export default function EditProductPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<ProductProperty | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Ürün listesini çek
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);

    // Düzenlenecek ProductProperty'i çek
    fetch(`/api/product-properties/${params.id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [params.id]);

  if (!form)
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-white">Yükleniyor...</div>
    );

  const handleSubmit = async () => {
    if (!form.productId || !form.name || !form.value) return;

    const res = await fetch(`/api/product-properties/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/product-properties");
    } else {
      alert("Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Özellik Düzenle</h1>

      <div className="flex flex-col gap-4 max-w-lg">
        <Select
          value={form.productId}
          onValueChange={(v) => setForm({ ...form, productId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ürün seçin" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Özellik Adı"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Değer"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/product-properties")}
          >
            İptal
          </Button>
          <Button onClick={handleSubmit}>Güncelle</Button>
        </div>
      </div>
    </div>
  );
}
