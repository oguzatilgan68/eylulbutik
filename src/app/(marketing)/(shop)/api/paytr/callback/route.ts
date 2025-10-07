import { PrismaClient } from "@/generated/prisma";
import crypto from "crypto";

export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const raw = await req.text();
  const params = new URLSearchParams(raw);

  const merchant_oid = params.get("merchant_oid") ?? "";
  const status = params.get("status") ?? "";
  const total_amount = params.get("total_amount") ?? "";
  const received_hash = params.get("hash") ?? "";

  const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY ?? "key";
  const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT ?? "salt";

  const verifyString = merchant_oid + MERCHANT_SALT + status + total_amount;
  const calc_hash = crypto
    .createHmac("sha256", MERCHANT_KEY)
    .update(verifyString)
    .digest("base64");

  if (calc_hash !== received_hash) {
    return new Response("bad hash", { status: 403 });
  }

  try {
    const existing = await prisma.payment.findUnique({
      where: { merchantOid: merchant_oid },
    });

    if (!existing) {
      await prisma.payment.create({
        data: {
          merchantOid: merchant_oid,
          amount: Number(total_amount),
          currency: "TL",
          status,
          raw: Object.fromEntries(params.entries()),
        },
      });
    } else {
      await prisma.payment.update({
        where: { merchantOid: merchant_oid },
        data: { status },
      });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    return new Response("ERR", { status: 500 });
  }
}
