"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react"; // ikonlar

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    const res = await fetch(
      `/api/admin/customers?page=${page}&limit=${limit}&search=${search}`
    );
    const data = await res.json();
    setUsers(data.users);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    const res = await fetch("/admin/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) fetchUsers();
  };

  const totalPages = Math.ceil(total / limit);
  const thClass = "border p-2";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Müşteriler</h1>

      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/admin/customers/new"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Yeni Müşteri Ekle
        </Link>
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className={thClass}>İsim</th>
            <th className={thClass}>Email</th>
            <th className={thClass}>Telefon</th>
            <th className={thClass}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className={thClass}>{user.fullName}</td>
              <td className={`${thClass} flex items-center gap-2`}>
                {user.email}
                {user.emailVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </td>
              <td className={thClass}>{user.phone || "-"}</td>
              <td className="border p-2 space-x-2">
                <Link
                  href={`/admin/customers/${user.id}`}
                  className="text-green-500"
                >
                  Düzenle
                </Link>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(user.id)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sayfalama */}
      <div className="mt-4 flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Önceki
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-2 py-1 border rounded ${
              p === page ? "bg-blue-500 text-white" : ""
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
