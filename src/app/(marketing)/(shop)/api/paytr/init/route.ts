import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID ?? "100000";
    const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY ?? "key";
    const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT ?? "salt";
    const TEST_MODE = process.env.PAYTR_TEST_MODE ?? "1";

    const merchant_oid = body.orderId ?? `order_${Date.now()}`;
    const amount = Number(body.amount ?? 1);
    const payment_amount = String(Math.round(amount * 100)); // kuruş
    const email = body.email ?? "customer@example.com";
    const user_ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const basket = [[body?.itemName ?? "Test Ürünü", amount.toFixed(2), 1]];
    const user_basket = Buffer.from(JSON.stringify(basket)).toString("base64");

    const no_installment = "0";
    const max_installment = "0";
    const currency = "TL";

    const hash_str =
      MERCHANT_ID +
      user_ip +
      merchant_oid +
      email +
      payment_amount +
      user_basket +
      no_installment +
      max_installment +
      currency +
      TEST_MODE;

    const paytr_token = crypto
      .createHmac("sha256", MERCHANT_KEY)
      .update(hash_str + MERCHANT_SALT)
      .digest("base64");

    const params = new URLSearchParams({
      merchant_id: MERCHANT_ID,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      user_basket,
      no_installment,
      max_installment,
      currency,
      test_mode: TEST_MODE,
      paytr_token,
    });

    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({
        ok: true,
        token: data.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
        merchant_oid,
      });
    }

    return NextResponse.json({ ok: false, error: data }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}
