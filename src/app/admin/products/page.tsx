"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/app/(marketing)/components/ui/Pagination";
import Select from "@/app/(marketing)/components/product/Select";
import { ActionButton } from "@/app/(marketing)/components/ui/ActionButton";
import TextInput from "@/app/(marketing)/components/ui/TextInput";
import { FiBox, FiPlus, FiSearch, FiTrash2, FiEdit2, FiTag, FiGrid } from "react-icons/fi";

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

const statusMap: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Taslak", class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
  PUBLISHED: { label: "Yayında", class: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
  ARCHIVED: { label: "Arşivlendi", class: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const effectiveSearch = debouncedSearch.length >= 3 ? debouncedSearch : "";
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
      setProducts(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Brands & Categories
  const fetchFilters = async () => {
    try {
      const [brandRes, categoryRes] = await Promise.all([
        fetch("/api/brands"),
        fetch("/api/categories"),
      ]);
      setBrands(await brandRes.json());
      setCategories(await categoryRes.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch, statusFilter, brandFilter, categoryFilter]);

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ ids: [id] }),
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!confirm(`Seçilen ${selectedIds.length} ürünü silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Select / Deselect All
  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(products.map((p) => p.id));
    else setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Yeni Ürün Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiBox className="text-pink-600" /> Ürün Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Mağazanızdaki tüm ürünleri listeleyin, fiyatlarını ve stok durumlarını güncelleyin.
          </p>
        </div>
        <ActionButton 
          href="/admin/products/new" 
          label="Yeni Ürün Ekle" 
          primary 
        />
      </div>

      {/* Filtreleme & Arama Çubuğu */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <TextInput
              placeholder="Ürün adı ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Tüm Durumlar", value: "" },
              ...Object.entries(statusMap).map(([v, l]) => ({
                value: v,
                label: l.label,
              })),
            ]}
          />

          <Select
            value={brandFilter}
            onChange={setBrandFilter}
            options={[
              { label: "Tüm Markalar", value: "" },
              ...brands.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />

          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: "Tüm Kategoriler", value: "" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">
              {selectedIds.length} ürün seçildi
            </span>
            <ActionButton
              label={`Seçilenleri Sil (${selectedIds.length})`}
              danger
              onClick={handleBulkDelete}
            />
          </div>
        )}
      </div>

      {/* Responsive Tablo */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === products.length &&
                      products.length > 0
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                </th>
                <th className="px-6 py-3.5">Ürün Adı</th>
                <th className="px-6 py-3.5">Marka</th>
                <th className="px-6 py-3.5">Kategori</th>
                <th className="px-6 py-3.5">Fiyat</th>
                <th className="px-6 py-3.5">Durum</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      <span>Ürünler yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => {
                  const statusInfo = statusMap[p.status] || { label: p.status, class: "" };
                  const displayPrice = p.variants?.[0]?.price ?? p.price;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
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
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            <img
                              src={p.images[0].url}
                              alt={p.images[0].alt || p.name}
                              className="w-11 h-11 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700">
                              <FiBox size={18} />
                            </div>
                          )}
                          <span className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                        {p.brand?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {p.category.name}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {displayPrice != null ? Number(displayPrice).toFixed(2) : "-"} ₺
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButton
                            href={`/admin/products/${p.id}`}
                            label="Düzenle"
                          />
                          <ActionButton
                            label="Sil"
                            onClick={() => handleDelete(p.id)}
                            danger
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Henüz ürün bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}