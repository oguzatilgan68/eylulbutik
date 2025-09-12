export default function ModelTab({ modelInfo }: { modelInfo?: string }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Model Bilgileri</h3>
      <p>{modelInfo || "Model bilgisi mevcut değil."}</p>
    </div>
  );
}
