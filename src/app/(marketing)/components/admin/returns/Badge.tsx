"use client";
import clsx from "clsx";

export default function Badge({ status }: { status: string }) {
  const color = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    APPROVED:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  }[status];
  return (
    <span className={clsx("px-2 py-1 rounded text-xs font-medium", color)}>
      {status === "PENDING"
        ? "Beklemede"
        : status === "APPROVED"
          ? "Onaylandı"
          : status === "REJECTED"
            ? "Reddedildi"
            : status === "REFUNDED"
              ? "İade Edildi"
              : status}
    </span>
  );
}
