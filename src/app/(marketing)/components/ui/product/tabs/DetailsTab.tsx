interface Property {
  id: string;
  key: string;
  value: string;
}

interface DetailsTabProps {
  properties?: Property[];
}

export default function DetailsTab({ properties }: DetailsTabProps) {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Ürün Özellikleri
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {properties.map((prop) => (
            <li
              key={prop.id}
              className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-sm flex items-center justify-between shadow-sm"
            >
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                {prop.key}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {prop.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}