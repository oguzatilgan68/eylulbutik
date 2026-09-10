"use client";
import clsx from "clsx";

export default function ActionButton({
  children,
  onClick,
  variant = "default",
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "ghost" | "success" | "danger";
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs",
        variant === "default" &&
          "bg-pink-600 text-white hover:bg-pink-700 shadow-pink-500/20",
        variant === "success" &&
          "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200/60 dark:border-emerald-900/30",
        variant === "danger" &&
          "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200/60 dark:border-rose-900/30",
        variant === "ghost" &&
          "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-700"
      )}
    >
      {children}
    </button>
  );
}