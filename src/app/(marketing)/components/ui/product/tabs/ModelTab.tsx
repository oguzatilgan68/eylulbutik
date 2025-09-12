interface ModelInfo {
  height?: number | null;
  weight?: number | null;
  chest?: number | null;
  waist?: number | null;
  hip?: number | null;
}

export default function ModelTab({ modelInfo }: { modelInfo?: ModelInfo }) {
  if (!modelInfo) {
    return (
      <div>
        <h3 className="font-semibold mb-2">Model Bilgileri</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Model bilgisi mevcut değil.
        </p>
      </div>
    );
  }

  const infos = [
    { label: "Boy", value: modelInfo.height ? `${modelInfo.height} cm` : null },
    {
      label: "Kilo",
      value: modelInfo.weight ? `${modelInfo.weight} kg` : null,
    },
    { label: "Göğüs", value: modelInfo.chest ? `${modelInfo.chest} cm` : null },
    { label: "Bel", value: modelInfo.waist ? `${modelInfo.waist} cm` : null },
    { label: "Kalça", value: modelInfo.hip ? `${modelInfo.hip} cm` : null },
  ];

  return (
    <div>
      <h3 className="font-semibold mb-4">Model Bilgileri</h3>
      <ul className="grid grid-cols-2 gap-3 text-sm">
        {infos.map(
          (info) =>
            info.value && (
              <li
                key={info.label}
                className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {info.label}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {info.value}
                </span>
              </li>
            )
        )}
      </ul>
    </div>
  );
}
