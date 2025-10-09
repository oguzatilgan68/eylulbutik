"use client";

export default function ProductAttributes({
  attributeTypes,
  selectedAttributes,
  setSelectedAttributes,
}: any) {
  return (
    <>
      {Object.entries(attributeTypes).map(([key, values]) => (
        <div key={key}>
          <h4 className="text-sm font-semibold dark:text-white mb-2">{key}</h4>
          <div className="flex gap-2 flex-wrap">
            {(values as string[]).map((val) => (
              <button
                key={val}
                onClick={() =>
                  setSelectedAttributes((prev: any) => ({
                    ...prev,
                    [key]: val,
                  }))
                }
                className={`px-3 py-2 rounded-lg border text-sm transition ${
                  selectedAttributes[key] === val
                    ? "bg-pink-500 text-white border-pink-500 shadow"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
