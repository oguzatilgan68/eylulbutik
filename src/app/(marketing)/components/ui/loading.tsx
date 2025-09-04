"use client";

import React from "react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean; // true olursa ekranı kaplar
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Yükleniyor...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300 ${
        fullScreen ? "fixed inset-0 bg-white dark:bg-gray-900 z-50" : ""
      }`}
    >
      <div className="w-8 h-8 border-4 border-t-pink-500 border-gray-300 rounded-full animate-spin"></div>
      <span className="text-lg">{message}</span>
    </div>
  );
};
