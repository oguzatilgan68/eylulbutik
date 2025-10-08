"use client";

import React from "react";
import Link from "next/link";

interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  label: string;
  primary?: boolean;
  danger?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  onClick,
  label,
  primary = false,
  danger = false,
  className = "",
}) => {
  const base = "px-3 py-1 rounded text-sm sm:text-base transition-all";
  const color = primary
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : danger
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600";

  if (href)
    return (
      <Link href={href} className={`${base} ${color} ${className}`}>
        {label}
      </Link>
    );

  return (
    <button onClick={onClick} className={`${base} ${color} ${className}`}>
      {label}
    </button>
  );
};
