"use client";

import { useEffect, useState } from "react";
import { Log } from "@/generated/prisma";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Pagination from "../ui/Pagination";
import { FiActivity, FiSearch, FiFilter, FiTrash2, FiX, FiInfo, FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";

interface LogsTableProps {}

export default function LogsTable({}: LogsTableProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [activeLog, setActiveLog] = useState<Log | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (level) params.append("level", level);
      params.append("page", page.toString());
      params.append("limit", "20");

      const res = await fetch(`/api/admin/log?${params.toString()}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, level, page]);

  const handleDelete = async (ids: string[], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!ids.length) return;
    if (!confirm(`Seçilen ${ids.length} adet log kaydını silmek istediğinize emin misiniz?`)) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/log", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (res.ok) {
        setSelectedIds([]);
        setActiveLog(null);
        fetchLogs();
      } else {
        alert("Loglar silinemedi.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(logs.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getLevelBadge = (lvl: string) => {
    const l = lvl.toLowerCase();
    if (l === "error") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"><FiAlertOctagon size={12} /> Error</span>;
    if (l === "warn") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"><FiAlertTriangle size={12} /> Warn</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"><FiInfo size={12} /> Info</span>;
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Üst Başlık */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiActivity className="text-pink-600" /> Sistem Logları
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Log detaylarını incelemek için herhangi bir satıra tıklayabilirsiniz.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <Button
            onClick={(e) => handleDelete(selectedIds, e)}
            disabled={deleting}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 text-xs shadow-md shadow-rose-500/20"
          >
            <FiTrash2 size={14} className="mr-1.5" />
            {deleting ? "Siliniyor..." : `Seçilenleri Sil (${selectedIds.length})`}
          </Button>
        )}
      </div>

      {/* 🛠️ Filtreler - Mobilde tam uyumlu hale getirildi */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Log mesajlarında ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <Select
            value={level || "all"}
            onValueChange={(val) => setLevel(val === "all" ? undefined : val)}
          >
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm">
              <SelectValue placeholder="Seviye Seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Seviyeler</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warn</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setPage(1);
              fetchLogs();
            }}
            className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-5 text-sm shadow-md shadow-pink-500/20 shrink-0"
          >
            <FiFilter size={14} className="mr-1.5" /> Filtrele
          </Button>
        </div>
      </div>

      {/* Log Tablosu */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse min-w-175">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={logs.length > 0 && selectedIds.length === logs.length}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3.5">Tarih</th>
                <th className="px-6 py-3.5">Seviye</th>
                <th className="px-6 py-3.5">Mesaj</th>
                <th className="px-6 py-3.5">Detay (Meta)</th>
                <th className="px-4 py-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loglar yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => {
                  const isSelected = selectedIds.includes(log.id);
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setActiveLog(log)}
                      className={`hover:bg-pink-50/20 dark:hover:bg-gray-800/40 transition-colors cursor-pointer ${
                        isSelected ? "bg-pink-50/30 dark:bg-gray-800/60" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(log.id, e as any)}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getLevelBadge(log.level)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white max-w-50 truncate">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400 max-w-50 truncate">
                        {typeof log.meta === "string"
                          ? log.meta
                          : log.meta == null
                          ? "-"
                          : JSON.stringify(log.meta)}
                      </td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDelete([log.id], e)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Tekli Sil"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Kayıtlı log bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination onPageChange={setPage} page={page} totalPages={totalPages} />
        </div>
      )}

      {/* 🔍 LOG DETAY MODALI */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
                  <FiActivity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log Detayları</h3>
                  <p className="text-xs text-gray-400">{new Date(activeLog.createdAt).toLocaleString("tr-TR")}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 overflow-y-auto pr-1 text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Log Seviyesi</span>
                <div>{getLevelBadge(activeLog.level)}</div>
              </div>

              {activeLog.status && (
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">HTTP Status Kodu</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{activeLog.status}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 space-y-1.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Log Mesajı</span>
                <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed break-all">{activeLog.message}</p>
              </div>

              {activeLog.stack && (
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1.5">
                  <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">Stack Trace</span>
                  <pre className="text-xs font-mono text-rose-600 dark:text-rose-400 whitespace-pre-wrap overflow-x-auto p-2 bg-white dark:bg-gray-900 rounded-xl border border-rose-200 dark:border-rose-900 max-h-40">
                    {activeLog.stack}
                  </pre>
                </div>
              )}

              {activeLog.meta != null && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 space-y-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Metadata (JSON)</span>
                  <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 max-h-48">
                    {typeof activeLog.meta === "string" ? activeLog.meta : JSON.stringify(activeLog.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <Button
                variant="destructive"
                onClick={() => handleDelete([activeLog.id])}
                className="rounded-xl px-4 text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                <FiTrash2 size={14} className="mr-1.5" /> Bu Logu Sil
              </Button>
              <Button
                onClick={() => setActiveLog(null)}
                className="rounded-xl px-5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Kapat
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}