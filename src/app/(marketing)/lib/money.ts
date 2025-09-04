import { Decimal } from "@prisma/client/runtime/library";
export function toPriceString(v?: Decimal | number | string | null) {
  if (v == null) return "0.00";
  if (typeof v === "object" && "toString" in v) return (v as any).toString();
  return String(v);
}
