"use client";
import clsx from "clsx";

export default function ActionButton({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3 py-1 rounded-md text-sm transition",
        variant === "default" &&
          "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
        variant === "ghost" &&
          "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}
