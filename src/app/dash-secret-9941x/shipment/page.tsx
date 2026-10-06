"use client";

import React, { useState, useEffect } from "react";

import { Shipment, ShipmentModal } from "@/app/(marketing)/components/shipment/shipmentModal";
import { ShipmentPagination } from "@/app/(marketing)/components/admin/ShipmentsAdmin/Pagination";
import { Header } from "@/app/(marketing)/components/admin/ShipmentsAdmin/Header";
import { Table } from "@/app/(marketing)/components/admin/ShipmentsAdmin/Table";


export default function ShipmentsAdmin() {
  const [list, setList] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchList();
  }, [q, filterProvider, filterStatus, page]);

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (filterProvider) params.set("provider", filterProvider);
      if (filterStatus) params.set("status", filterStatus);
      params.set("page", String(page));
      params.set("perPage", String(perPage));

      const res = await fetch(`/api/admin/shipments?${params.toString()}`);
      if (!res.ok) throw new Error("Liste yüklenemedi");
      const json = await res.json();
      setList(Array.isArray(json.data) ? json.data : []);
      setTotal(json.meta?.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Hata");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: Shipment) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/shipments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme başarısız");
      fetchList();
    } catch (err: any) {
      alert(err.message || "Hata");
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-lg">
      <Header
        q={q}
        setQ={setQ}
        filterProvider={filterProvider}
        setFilterProvider={setFilterProvider}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        openCreate={openCreate}
      />

      <Table
        list={list}
        loading={loading}
        page={page}
        perPage={perPage}
        openEdit={openEdit}
        handleDelete={handleDelete}
      />

      <ShipmentPagination
        page={page}
        setPage={setPage}
        total={total}
        perPage={perPage}
      />

      {modalOpen && (
        <ShipmentModal
          initial={editing}
          onClose={() => {
            setModalOpen(false);
            fetchList();
          }}
        />
      )}

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
