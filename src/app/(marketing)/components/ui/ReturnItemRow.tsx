// components/returns/ReturnItemRow.tsx
"use client";

import Image from "next/image";

interface ReturnItemRowProps {
  item: {
    id: string;
    name: string;
    qty: number;
    returnQty: number;
    reason: string;
    changeable: boolean;
    thumbnail?: string; // ürün veya varyasyon görseli
  };
  onChangeQty: (id: string, value: number) => void;
  onChangeReason: (id: string, value: string) => void;
  returnReasons: { label: string; value: string }[];
}

export default function ReturnItemRow({
  item,
  onChangeQty,
  onChangeReason,
  returnReasons,
}: ReturnItemRowProps) {
  const increment = () => {
    if (!item.changeable) return;
    if (item.returnQty < item.qty) onChangeQty(item.id, item.returnQty + 1);
  };

  const decrement = () => {
    if (!item.changeable) return;
    if (item.returnQty > 0) onChangeQty(item.id, item.returnQty - 1);
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Ürün / varyasyon görseli */}
      <div className="w-20 h-20 flex-shrink-0">
        {item.thumbnail ? (
          <Image
            width={80}
            height={80}
            src={item.thumbnail}
            alt={item.name}
            className="w-full h-full object-cover rounded border"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
            Resim Yok
          </div>
        )}
      </div>

      {/* Ürün bilgileri ve iade inputları */}
      <div className="flex-1 w-full">
        <p
          className={`text-gray-800 dark:text-gray-200 font-medium ${
            !item.changeable ? "opacity-50" : ""
          }`}
        >
          {item.name} (Mevcut: {item.qty})
        </p>

        {item.changeable ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
            {/* Quantity butonları */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              <button
                type="button"
                onClick={decrement}
                disabled={item.returnQty <= 0}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
              >
                -
              </button>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-12 text-center">
                {item.returnQty}
              </span>
              <button
                type="button"
                onClick={increment}
                disabled={item.returnQty >= item.qty}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
              >
                +
              </button>
            </div>

            {/* Sebep seçimi */}
            <select
              value={item.reason}
              onChange={(e) => onChangeReason(item.id, e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-1 w-full sm:w-[250px] rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">-- Sebep Seçin --</option>
              {returnReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
            Bu ürün iade edilemez
          </p>
        )}
      </div>
    </div>
  );
}
