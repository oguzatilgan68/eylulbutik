// pages/api/payment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/(marketing)/lib/db";
import Iyzipay from "iyzipay";
import { Decimal } from "@prisma/client/runtime/library";
import jwt from "jsonwebtoken";

// Iyzipay client
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL!,
});

// Basit token doğrulama
export async function getAuthUserId(
  req: NextApiRequest
): Promise<string | null> {
  const cookieHeader = req.headers.cookie || "";
  const tokenCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="));

  const token = tokenCookie?.split("=")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const userId = await getAuthUserId(req);
  if (!userId)
    return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const { payment, orderData } = req.body;
    if (!payment || !orderData?.addressId || !orderData?.total) {
      return res
        .status(400)
        .json({ success: false, error: "Eksik sipariş bilgileri" });
    }

    const requestBody = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "ORDER-" + Date.now(),
      price: orderData.total.toString(),
      paidPrice: orderData.total.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      basketId: "ORDER-" + Date.now(),
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: payment.fullName,
        cardNumber: payment.cardNumber.replace(/\s/g, ""),
        expireMonth: payment.expiry.split("/")[0],
        expireYear: "20" + payment.expiry.split("/")[1],
        cvc: payment.cvc,
        registerCard: "0",
      },
      buyer: {
        id: userId.toString(),
        name: payment.fullName.split(" ")[0] || "John",
        surname: payment.fullName.split(" ")[1] || "Doe",
        gsmNumber: "+905350000000",
        email: "test@example.com",
        identityNumber: "74300864791",
        registrationAddress: "Test adres",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
      },
      shippingAddress: {
        contactName: payment.fullName,
        city: "Istanbul",
        country: "Turkey",
        address: "Test adres",
        zipCode: "34732",
      },
      billingAddress: {
        contactName: payment.fullName,
        city: "Istanbul",
        country: "Turkey",
        address: "Test adres",
        zipCode: "34732",
      },
      basketItems: orderData.basketItems.map((item: any, index: number) => ({
        id: "BI" + (index + 1),
        name: item.name || `Ürün ${index + 1}`,
        category1: "Genel",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: item.unitPrice.toString() || "100",
        quantity: item.qty.toString() || "1",
      })),
    };

    const iyziResponse: any = await new Promise((resolve, reject) => {
      console.log("Iyzipay request body:", requestBody);
      iyzipay.payment.create(requestBody, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (iyziResponse.status === "success") {
      const subtotal = orderData.basketItems.reduce(
        (acc: any, item: any) => acc + item.unitPrice * item.qty,
        0
      );

      const user = await db.user.findUnique({ where: { id: userId } });
      const order = await db.order.create({
        data: {
          user: {
            connect: { id: userId },
          },
          address: {
            connect: { id: orderData.addressId },
          },
          phone: orderData?.phone || null,
          total: new Decimal(orderData.total || subtotal),
          subtotal: new Decimal(subtotal),
          discountTotal: new Decimal(orderData.discount || 0),
          shippingTotal: new Decimal(0),
          taxTotal: new Decimal(subtotal * 0.2),
          status: "PAID",
          orderNo: `ORD-${Date.now()}`,
          items: {
            create: orderData.basketItems.map((item: any) => ({
              name: item.name || "Ürün",
              productId: item.id,
              variantId: item.variantId || null,
              qty: item.qty,
              unitPrice: new Decimal(item.unitPrice),
            })),
          },
          payment: {
            create: {
              provider: "iyzico",
              status: "SUCCEEDED",
              txId: iyziResponse.paymentId,
              raw: iyziResponse,
            },
          },
        },
      });
    }
    const cart = await db.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await db.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await db.cart.delete({
        where: { id: cart.id },
      });
    }
    return res.status(201).json({ success: true, data: iyziResponse });
  } catch (err) {
    console.error("Hata:", err);
    return res.status(400).json({ success: false, error: err });
  }
}
