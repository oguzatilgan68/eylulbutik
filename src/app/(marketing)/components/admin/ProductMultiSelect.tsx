"use client";

type Product = {
  id: string;
  name: string;
};

interface Props {
  products: Product[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function ProductMultiSelect({ products, value, onChange }: Props) {
  const handleToggle = (productId: string) => {
    if (value.includes(productId)) {
      onChange(value.filter((id) => id !== productId));
    } else {
      onChange([...value, productId]);
    }
  };

  return (
    <div className="mt-3 space-y-3 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {products.map((product) => (
          <label
            key={product.id}
            className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <input
              type="checkbox"
              checked={value.includes(product.id)}
              onChange={() => handleToggle(product.id)}
              className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
            />
            <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
              {product.name}
            </span>
          </label>
        ))}
      </div>

      {/* Seçilen ürünler etiket olarak gösterilir */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((id) => {
            const product = products.find((p) => p.id === id);
            return (
              <span
                key={id}
                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 text-blue-800 rounded-lg"
              >
                {product?.name || "Ürün"}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
