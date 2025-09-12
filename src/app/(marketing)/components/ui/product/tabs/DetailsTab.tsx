interface Property {
  id: string;
  key: string;
  value: string;
}

interface DetailsTabProps {
  properties?: Property[];
}

export default function DetailsTab({ properties }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      {properties && properties.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Ürün Özellikleri</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {properties.map((prop) => (
              <li
                key={prop.id}
                className="border rounded-md p-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="font-medium">{prop.key}: </span>
                <span>{prop.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
