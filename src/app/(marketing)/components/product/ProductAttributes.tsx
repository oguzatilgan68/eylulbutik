"use client";

interface ProductAttributesProps {
  attributeTypes: Record<string, string[]>;
  selectedAttributes: Record<string, string>;
  setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function ProductAttributes({
  attributeTypes,
  selectedAttributes,
  setSelectedAttributes,
}: ProductAttributesProps) {
  if (!attributeTypes || Object.keys(attributeTypes).length === 0) return null;

  return (
    <div className="space-y-5">
      {Object.entries(attributeTypes).map(([key, values]) => (
        <div key={key} className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-400 uppercase tracking-wider">{key}</span>
            <span className="text-pink-600 dark:text-pink-400 font-bold">
              {selectedAttributes[key] || "Seçiniz"}
            </span>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {(values as string[]).map((val) => {
              const isSelected = selectedAttributes[key] === val;
              return (
                <button
                  type="button"
                  key={val}
                  onClick={() =>
                    setSelectedAttributes((prev) => ({
                      ...prev,
                      [key]: val,
                    }))
                  }
                  className={`px-5 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-500/20 ring-2 ring-pink-500/20"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-gray-700"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}