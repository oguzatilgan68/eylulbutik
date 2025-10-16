"use client";

import Badge from "./Badge";
import ActionButton from "./ActionButton";
import { ReturnRequestWithRelations } from "./types";

interface ReturnsTableProps {
  list: ReturnRequestWithRelations[];
  onSelect: (r: ReturnRequestWithRelations) => void;
  onUpdate: (id: string, status: string) => void;
}

export default function ReturnsTable({
  list,
  onSelect,
  onUpdate,
}: ReturnsTableProps) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-2 text-left">Müşteri</th>
            <th className="px-4 py-2 text-left">Ürün</th>
            <th className="px-4 py-2 text-left">Durum</th>
            <th className="px-4 py-2 text-left">Tarih</th>
            <th className="px-4 py-2 text-left">Yorum</th>
            <th className="px-4 py-2 text-left">Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr
              key={r.id}
              className="border-t border-slate-200 dark:border-slate-700"
            >
              <td className="px-4 py-2">
                {r.user?.fullName || r.user?.email || "Guest"}
              </td>
              <td className="px-4 py-2">
                {r.items.map((i) => i.orderItem.name).join(", ")}
              </td>
              <td className="px-4 py-2">
                <Badge status={r.status} />
              </td>
              <td className="px-4 py-2">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{r.comment || "-"}</td>
              <td className="px-4 py-2 flex flex-wrap gap-2">
                <ActionButton onClick={() => onSelect(r)}>Detay</ActionButton>
                {r.status !== "APPROVED" && (
                  <ActionButton onClick={() => onUpdate(r.id, "APPROVED")}>
                    Onayla
                  </ActionButton>
                )}
                {r.status !== "REJECTED" && (
                  <ActionButton onClick={() => onUpdate(r.id, "REJECTED")}>
                    Reddet
                  </ActionButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
