"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BrandFormProps {
  initialData?: { name: string; logoUrl?: string };
  brandId?: string;
}

export default function BrandForm({ initialData, brandId }: BrandFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = brandId ? "PATCH" : "POST";
    const url = brandId ? `/api/brands/${brandId}` : "/api/brands";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, logoUrl }),
    });
    router.push("/admin/brands");
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow space-y-4"
    >
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Logo URL</label>
        <input
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
      >
        {brandId ? "Düzenle" : "Oluştur"}
      </button>
    </form>
  );
}
