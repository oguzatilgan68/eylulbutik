"use client";

import { useState, useEffect, use } from "react";
import AttributeForm from "@/app/(marketing)/components/forms/AttributeForm";
import { useRouter } from "next/navigation";
import React from "react";

interface AttributeType {
  name: string;
  values: { value: string }[];
}

export default function EditAttributePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const router = useRouter();
  const [initialData, setInitialData] = useState<{
    name: string;
    values: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/attribute-types/${params.id}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Attribute yüklenemedi");
        const type: AttributeType = await res.json();
        setInitialData({
          name: type.name,
          values: type.values.map((v) => v.value),
        });
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (data: { name: string; values: string[] }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/attribute-types`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params.id, ...data }),
        }
      );
      if (!res.ok) throw new Error("Attribute tipi güncellenemedi");
      router.push("/admin/attribute-types");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (error) return <p className="p-6">{error}</p>;
  if (!initialData) return null;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Attribute Tipi Düzenle</h1>
      <AttributeForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
