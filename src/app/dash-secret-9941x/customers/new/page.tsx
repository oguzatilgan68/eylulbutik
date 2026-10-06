"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/admin/users/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone }),
    });
    router.push("/admin/users");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Yeni Müşteri Ekle</h1>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="İsim"
        className="w-full p-2 mb-2 border"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-2 border"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefon"
        className="w-full p-2 mb-2 border"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Kaydet
      </button>
    </form>
  );
}
