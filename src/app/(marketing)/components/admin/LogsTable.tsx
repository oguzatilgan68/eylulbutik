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

interface LogsTableProps {}

export default function LogsTable({}: LogsTableProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (level) params.append("level", level);
    params.append("page", page.toString());
    params.append("limit", "20");

    const res = await fetch(`/api/log?${params.toString()}`);
    const data = await res.json();
    setLogs(data.logs);
    setTotalPages(data.pagination.totalPages);
  };

  useEffect(() => {
    fetchLogs();
  }, [search, level, page]);

  return (
    <div className="p-4">
      {/* Filtreler */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={level}
          onValueChange={(val) => setLevel(val || undefined)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seviye" />
          </SelectTrigger>
          <SelectContent>
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
        >
          Filtrele
        </Button>
      </div>

      {/* Log Tablosu */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border-b">Tarih</th>
              <th className="p-2 border-b">Seviye</th>
              <th className="p-2 border-b">Mesaj</th>
              <th className="p-2 border-b">Detay</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="p-2 border-b">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-2 border-b">{log.level}</td>
                <td className="p-2 border-b">{log.message}</td>
                <td className="p-2 border-b">
                  {typeof log.meta === "string"
                    ? log.meta
                    : log.meta == null
                      ? ""
                      : JSON.stringify(log.meta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination onPageChange={setPage} page={page} totalPages={totalPages} />
    </div>
  );
}
