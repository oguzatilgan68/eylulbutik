// app/api/paytr/status/route.ts
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { merchantOid } = await req.json();

  if (!merchantOid)
    return NextResponse.json({ success: false, error: "Missing merchantOid" });

  try {
    const payment = await db.payment.findUnique({ where: { merchantOid } });
    if (!payment)
      return NextResponse.json({ success: false, error: "Payment not found" });

    return NextResponse.json({ success: true, status: payment.status });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
