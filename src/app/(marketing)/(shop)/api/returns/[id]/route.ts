import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { action, note } = body; // action: APPROVE | REJECT | RECEIVE

    const rr = await db.returnRequest.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!rr) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "APPROVE") {
      const updated = await db.returnRequest.update({
        where: { id },
        data: { status: "APPROVED", updatedAt: new Date() },
      });
      // optionally change items status
      await db.returnItem.updateMany({
        where: { returnRequestId: id },
        data: { status: "APPROVED" },
      });
      return NextResponse.json(updated);
    }

    if (action === "REJECT") {
      const updated = await db.returnRequest.update({
        where: { id },
        data: { status: "REJECTED" },
      });
      await db.returnItem.updateMany({
        where: { returnRequestId: id },
        data: { status: "REJECTED" },
      });
      return NextResponse.json(updated);
    }

    if (action === "RECEIVE") {
      const updated = await db.returnRequest.update({
        where: { id },
        data: { status: "RECEIVED" },
      });
      await db.returnItem.updateMany({
        where: { returnRequestId: id },
        data: { status: "RECEIVED" },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
