import { db } from "@/app/(marketing)/lib/db";

export async function GET() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  return new Response(JSON.stringify(categories), { status: 200 });
}
