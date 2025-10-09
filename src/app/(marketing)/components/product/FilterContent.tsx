"use client";

import React from "react";

interface FilterContentProps {
  attributeTypes: { [key: string]: string[] };
  selectedAttributes: { [key: string]: string };
  setSelectedAttributes: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  onClose: () => void;
}

const FilterContent: React.FC<FilterContentProps> = ({
  attributeTypes,
  selectedAttributes,
  setSelectedAttributes,
  onClose,
}) => (
  <>
    {/* Mobil: bottom sheet, Masaüstü: sidebar */}
    <div className="fixed md:relative bottom-0 md:top-0 md:right-0 md:w-96 h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-6 overflow-y-auto rounded-t-2xl md:rounded-none animate-slideUp md:animate-slideIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-gray-100">Filtrele</h3>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 text-sm"
        >
          Kapat
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(attributeTypes).map(([key, values]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              {key}
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
              value={selectedAttributes[key] || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedAttributes((prev) => {
                  const newAttrs = { ...prev };
                  if (!value) delete newAttrs[key];
                  else newAttrs[key] = value;
                  return newAttrs;
                });
              }}
            >
              <option value="">Tümü</option>
              {values.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
      >
        Uygula
      </button>
    </div>

    <style jsx>{`
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
      .animate-slideIn {
        animation: slideIn 0.3s ease-out;
      }
    `}</style>
  </>
);

export default FilterContent;
