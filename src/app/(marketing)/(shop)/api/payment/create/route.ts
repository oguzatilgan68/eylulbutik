import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

var Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL!,
});

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { payment, orderData } = await req.json();
    // orderData: { userId, addressId, total, vs. }

    if (
      !orderData ||
      !orderData.userId ||
      !orderData.addressId ||
      !orderData.total
    ) {
      return NextResponse.json(
        { success: false, error: "Eksik sipariş bilgileri" },
        { status: 400 }
      );
    }

    const request = {
      locale: "tr",
      conversationId: "ORDER-" + Date.now(),
      price: orderData.total.toString(),
      paidPrice: orderData.total.toString(),
      currency: "TRY",
      installment: "1",
      basketId: "ORDER-" + Date.now(),
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      paymentCard: {
        cardHolderName: payment.fullName,
        cardNumber: payment.cardNumber.replace(/\s/g, ""),
        expireMonth: payment.expiry.split("/")[0],
        expireYear: "20" + payment.expiry.split("/")[1],
        cvc: payment.cvc,
        registerCard: 0,
      },
      buyer: {
        id: userId,
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
        name: item.name,
        category1: "Genel",
        itemType: "PHYSICAL",
        price: item.unitPrice.toString(),
      })),
    };

    // Ödeme isteği gönder
    const iyziResponse = await new Promise<any>((resolve, reject) => {
      iyzipay.payment.create(request, function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (iyziResponse.status === "success") {
      // Siparişi oluştur
      const order = await db.order.create({
        data: {
          userId: userId,
          addressId: orderData.addressId,
          total: orderData.total,
          status: "PAID",
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

      return NextResponse.json({ success: true, orderId: order.id });
    } else {
      return NextResponse.json(
        { success: false, error: iyziResponse },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
