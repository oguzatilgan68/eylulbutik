import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cartItemId, action, qty } = await req.json();

    if (action === "remove") {
      await db.cartItem.delete({ where: { id: cartItemId } });
    } else if (action === "update") {
      await db.cartItem.update({
        where: { id: cartItemId },
        data: { qty: qty },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Sepet güncellenemedi" },
      { status: 500 }
    );
  }
}
