"use client";

import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${className}`}
    />
  );
};

export default TextInput;
