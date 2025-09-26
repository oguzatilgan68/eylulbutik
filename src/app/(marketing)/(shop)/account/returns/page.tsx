import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import ReturnsList from "./returnDetailModal";

export default async function ReturnsPage() {
  const userId = await getAuthUserId();

  const returnsRaw = await db.returnRequest.findMany({
    where: { userId },
    include: { items: { include: { orderItem: true } } },
    orderBy: { createdAt: "desc" },
  });

  const returns = JSON.parse(JSON.stringify(returnsRaw));
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ReturnsList returns={returns} />
    </div>
  );
}
