"use client";

import Badge from "./Badge";
import ActionButton from "./ActionButton";
import { ReturnRequestWithRelations } from "./types";

interface ReturnsCardsProps {
  list: ReturnRequestWithRelations[];
  onSelect: (r: ReturnRequestWithRelations) => void;
  onUpdate: (id: string, status: string) => void;
}

export default function ReturnsCards({
  list,
  onSelect,
  onUpdate,
}: ReturnsCardsProps) {
  return (
    <div className="grid gap-4 sm:hidden">
      {list.map((r) => (
        <div
          key={r.id}
          className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">
              {r.user?.fullName || r.user?.email || r.user?.phone || "Guest"}
            </div>
            <Badge status={r.status} />
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {r.items.length} ürün • {new Date(r.createdAt).toLocaleDateString()}
          </div>
          <div className="text-sm line-clamp-2 mb-3">{r.comment || "-"}</div>
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      ))}
    </div>
  );
}
