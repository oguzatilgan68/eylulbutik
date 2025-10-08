"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";

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

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-2xl font-bold">Müşteriler</h1>

      {/* Arama & Yeni Müşteri */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <Link
          href="/admin/customers/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Yeni Müşteri Ekle
        </Link>
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
        />
      </div>

      {/* Responsive Tablo */}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-800 text-sm sm:text-base">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {["İsim", "Email", "Telefon", "İşlemler"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2 whitespace-nowrap">
                    {user.email}
                    {user.emailVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {user.phone || "-"}
                  </td>
                  <td className="px-4 py-2 flex flex-wrap gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/customers/${user.id}`}
                      className="text-green-500 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:underline"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Henüz müşteri bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
