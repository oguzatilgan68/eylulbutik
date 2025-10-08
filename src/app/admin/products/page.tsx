"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import Select from "@/app/(marketing)/components/product/Select";
import { ActionButton } from "@/app/(marketing)/components/ui/ActionButton";
import TextInput from "@/app/(marketing)/components/ui/TextInput";

interface Product {
  id: string;
  name: string;
  status: string;
  price: number | null;
  brand?: { id: string; name: string };
  category: { id: string; name: string };
  images: { url: string; alt?: string }[];
  variants: { price: number }[];
}

const statusMap: Record<string, string> = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşivlendi",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const pageSize = 10;
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms bekle
    return () => clearTimeout(handler);
  }, [search]);
  // Fetch Products
  const fetchProducts = async () => {
    const effectiveSearch = search.length >= 3 ? search : "";
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: effectiveSearch,
      status: statusFilter,
      brandId: brandFilter,
      categoryId: categoryFilter,
    });
    const res = await fetch(`/api/admin/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data.items);
    setTotalPages(data.totalPages);
  };

  // Fetch Brands & Categories
  const fetchFilters = async () => {
    const [brandRes, categoryRes] = await Promise.all([
      fetch("/api/brands"),
      fetch("/api/categories"),
    ]);
    setBrands(await brandRes.json());
    setCategories(await categoryRes.json());
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch, statusFilter, brandFilter, categoryFilter]);

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ ids: [id] }),
    });
    if (res.ok) fetchProducts();
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!confirm("Seçilen ürünleri silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/admin/products`, {
      method: "DELETE",
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (res.ok) {
      setSelectedIds([]);
      fetchProducts();
    }
  };

  // Select / Deselect All
  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(products.map((p) => p.id));
    else setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-bold">Ürün Listesi</h2>
        <ActionButton href="/admin/products/new" label="Yeni Ürün" primary />
      </div>

      {/* Filtreleme & Arama */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center flex-wrap">
        <TextInput
          placeholder="Ürün adı ile ara"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Durum Seç", value: "" },
            ...Object.entries(statusMap).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <Select
          value={brandFilter}
          onChange={setBrandFilter}
          options={[
            { label: "Marka Seç", value: "" },
            ...brands.map((b) => ({ value: b.id, label: b.name })),
          ]}
        />
        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { label: "Kategori Seç", value: "" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        {selectedIds.length > 0 && (
          <ActionButton
            label={`Seçilenleri Sil (${selectedIds.length})`}
            danger
            onClick={handleBulkDelete}
          />
        )}
      </div>

      {/* Responsive Tablo */}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full min-w-[700px] table-auto text-sm sm:text-base border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === products.length &&
                    products.length > 0
                  }
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              {["Adı", "Marka", "Kategori", "Fiyat", "Durum", "İşlemler"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left whitespace-nowrap"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {products.length > 0 ? (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedIds((prev) => [...prev, p.id]);
                        else
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== p.id)
                          );
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2 min-w-[150px]">
                    {p.images[0] && (
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt || p.name}
                        className="w-10 h-10 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <span className="line-clamp-2">{p.name}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {p.brand?.name || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {p.category.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {(p.variants?.[0]?.price ?? p.price != null)
                      ? Number(p.price).toFixed(2)
                      : "-"}{" "}
                    TRY
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {statusMap[p.status] || p.status}
                  </td>
                  <td className="px-4 py-2 flex flex-wrap gap-2 whitespace-nowrap">
                    <ActionButton
                      href={`/admin/products/${p.id}`}
                      label="Düzenle"
                    />
                    <ActionButton
                      label="Sil"
                      onClick={() => handleDelete(p.id)}
                      danger
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Henüz ürün bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
