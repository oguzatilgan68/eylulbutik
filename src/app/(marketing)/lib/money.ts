
export function toPriceString(v?:number | string | null) {
  if (v == null) return "0.00";
  if (typeof v === "object" && "toString" in v) return (v as any).toString();
  return String(v);
}
