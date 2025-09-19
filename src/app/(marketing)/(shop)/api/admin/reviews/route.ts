import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

async function isAdmin(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

// Listeleme
export async function GET() {
  const userId = await getAuthUserId();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await db.review.findMany({
    include: {
      product: { select: { id: true, slug: true, name: true } },
      user: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

// Güncelleme (onayla / düzenle)
export async function PUT(req: Request) {
  const userId = await getAuthUserId();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, data } = await req.json();

  const review = await db.review.update({
    where: { id },
    data,
  });

  return NextResponse.json(review);
}

// Silme (reddetme)
export async function DELETE(req: Request) {
  const userId = await getAuthUserId();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  await db.review.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
