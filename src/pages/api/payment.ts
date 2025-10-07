// import type { NextApiRequest, NextApiResponse } from "next";
// import { db } from "@/app/(marketing)/lib/db";
// import Iyzipay from "iyzipay";
// import { Decimal } from "@prisma/client/runtime/library";
// import jwt from "jsonwebtoken";
// import { sendEmail } from "@/app/(marketing)/lib/mail";

// // Iyzipay client
// const iyzipay = new Iyzipay({
//   apiKey: process.env.IYZICO_API_KEY!,
//   secretKey: process.env.IYZICO_SECRET_KEY!,
//   uri: process.env.IYZICO_BASE_URL!,
// });

// // Basit token doğrulama (cookie üzerinden)
// async function getAuthUserId(req: NextApiRequest): Promise<string | null> {
//   const cookieHeader = req.headers.cookie || "";
//   const tokenCookie = cookieHeader
//     .split(";")
//     .map((c) => c.trim())
//     .find((c) => c.startsWith("token="));

//   const token = tokenCookie?.split("=")[1];
//   if (!token) return null;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//     };
//     return decoded.userId;
//   } catch {
//     return null;
//   }
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res
//       .status(405)
//       .json({ success: false, error: "Method Not Allowed" });
//   }

//   try {
//     const userId = await getAuthUserId(req);
//     if (!userId) {
//       return res.status(401).json({ success: false, error: "Unauthorized" });
//     }

//     const { payment, orderData } = req.body;

//     if (!payment || !orderData?.addressId || !orderData?.total) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Eksik sipariş bilgileri" });
//     }

//     const requestBody = {
//       locale: Iyzipay.LOCALE.TR,
//       conversationId: "ORDER-" + Date.now(),
//       price: orderData.total.toString(),
//       paidPrice: orderData.total.toString(),
//       currency: Iyzipay.CURRENCY.TRY,
//       installment: "1",
//       basketId: "ORDER-" + Date.now(),
//       paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
//       paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
//       paymentCard: {
//         cardHolderName: payment.fullName,
//         cardNumber: payment.cardNumber.replace(/\s/g, ""),
//         expireMonth: payment.expiry.split("/")[0],
//         expireYear: "20" + payment.expiry.split("/")[1],
//         cvc: payment.cvc,
//         registerCard: "0",
//       },
//       buyer: {
//         id: userId.toString(),
//         name: payment.fullName.split(" ")[0] || "John",
//         surname: payment.fullName.split(" ")[1] || "Doe",
//         gsmNumber: "+905350000000",
//         email: "test@example.com",
//         identityNumber: "74300864791",
//         registrationAddress: "Test adres",
//         city: "Istanbul",
//         country: "Turkey",
//         zipCode: "34732",
//       },
//       shippingAddress: {
//         contactName: payment.fullName,
//         city: "Istanbul",
//         country: "Turkey",
//         address: "Test adres",
//         zipCode: "34732",
//       },
//       billingAddress: {
//         contactName: payment.fullName,
//         city: "Istanbul",
//         country: "Turkey",
//         address: "Test adres",
//         zipCode: "34732",
//       },
//       basketItems: orderData.basketItems.map((item: any, index: number) => ({
//         id: "BI" + (index + 1),
//         name: item.name || `Ürün ${index + 1}`,
//         category1: "Genel",
//         itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
//         price: item.unitPrice.toString() || "100",
//         quantity: item.qty.toString() || "1",
//       })),
//     };

//     const iyziResponse: any = await new Promise((resolve, reject) => {
//       iyzipay.payment.create(requestBody, (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       });
//     });

//     if (iyziResponse.status === "success") {
//       const subtotal = orderData.basketItems.reduce(
//         (acc: any, item: any) => acc + item.unitPrice * item.qty,
//         0
//       );

//       const user = await db.user.findUnique({ where: { id: userId } });

//       const order = await db.order.create({
//         data: {
//           user: { connect: { id: userId } },
//           address: { connect: { id: orderData.addressId } },
//           phone: orderData?.phone || null,
//           total: new Decimal(orderData.total || subtotal),
//           subtotal: new Decimal(subtotal),
//           discountTotal: new Decimal(orderData.discount || 0),
//           shippingTotal: new Decimal(0),
//           taxTotal: new Decimal(subtotal * 0.2),
//           status: "PAID",
//           orderNo: `ORD-${Date.now()}`,
//           items: {
//             create: orderData.basketItems.map((item: any) => ({
//               name: item.name || "Ürün",
//               productId: item.id,
//               variantId: item.variantId || null,
//               qty: item.qty,
//               unitPrice: new Decimal(item.unitPrice),
//             })),
//           },
//           payment: {
//             create: {
//               provider: "iyzico",
//               status: "SUCCEEDED",
//               txId: iyziResponse.paymentId,
//               raw: iyziResponse,
//             },
//           },
//         },
//         include: { items: true },
//       });

//       if (user?.email) {
//         const orderItemsHtml = order.items
//           .map(
//             (i) =>
//               `<li>${i.name} - ${i.qty} x ${i.unitPrice.toFixed(2)}₺ = ${(
//                 i.qty * Number(i.unitPrice)
//               ).toFixed(2)}₺</li>`
//           )
//           .join("");

//         const mailHtml = `
// <!DOCTYPE html>
// <html lang="tr">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>Sipariş Onayı</title>
// <style>
//   body {
//     margin: 0;
//     padding: 0;
//     font-family: 'Helvetica', 'Arial', sans-serif;
//     background-color: #f7f7f7;
//   }
//   .email-container {
//     max-width: 600px;
//     margin: 0 auto;
//     background-color: #ffffff;
//     border-radius: 8px;
//     overflow: hidden;
//     box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//   }
//   .header {
//     background-color: #ff6f61;
//     color: #ffffff;
//     text-align: center;
//     padding: 25px 20px;
//     font-size: 24px;
//     font-weight: bold;
//   }
//   .content {
//     padding: 30px 20px;
//     color: #333333;
//     line-height: 1.6;
//   }
//   .content h2 {
//     color: #ff6f61;
//   }
//   .content p {
//     margin: 10px 0;
//   }
//   .order-details {
//     margin: 20px 0;
//     padding: 15px;
//     background-color: #f4f4f4;
//     border-radius: 5px;
//   }
//   .order-details ul {
//     padding-left: 20px;
//   }
//   .button {
//     display: inline-block;
//     padding: 12px 25px;
//     margin: 20px 0;
//     background-color: #ff6f61;
//     color: #ffffff;
//     text-decoration: none;
//     border-radius: 5px;
//     font-weight: bold;
//     text-align: center;
//   }
//   .footer {
//     padding: 20px;
//     text-align: center;
//     font-size: 12px;
//     color: #888888;
//     background-color: #f7f7f7;
//   }
//   @media only screen and (max-width: 480px) {
//     .email-container {
//       width: 95% !important;
//     }
//     .header {
//       font-size: 20px !important;
//       padding: 15px !important;
//     }
//     .content {
//       padding: 20px 15px !important;
//     }
//     .button {
//       padding: 10px 20px !important;
//     }
//   }
// </style>
// </head>
// <body>
//   <div class="email-container">
//     <div class="header">
//       Eylül Butik
//     </div>
//     <div class="content">
//       <h2>Merhaba ${user.fullName},</h2>
//       <p>Siparişiniz başarıyla oluşturuldu. 🎉</p>
//       <div class="order-details">
//         <p><b>Sipariş No:</b> ${order.orderNo}</p>
//         <ul>
//           ${orderItemsHtml}
//         </ul>
//         <p><b>Toplam:</b> ${order.total.toFixed(2)}₺</p>
//       </div>
//       <p style="text-align:center;">
//         <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${
//           order.id
//         }" class="button">Siparişinizi Görüntüleyin</a>
//       </p>
//       <p>Teşekkür ederiz! 💖</p>
//     </div>
//     <div class="footer">
//       &copy; ${new Date().getFullYear()} Eylül Butik. Tüm hakları saklıdır.
//     </div>
//   </div>
// </body>
// </html>
// `;

//         await sendEmail({
//           to: user.email,
//           subject: "Siparişiniz Alındı",
//           html: mailHtml,
//         });
//       }

//       // Sepeti temizle
//       const cart = await db.cart.findFirst({ where: { userId } });
//       if (cart) {
//         await db.cartItem.deleteMany({ where: { cartId: cart.id } });
//         await db.cart.delete({ where: { id: cart.id } });
//       }

//       // Stok düşür
//       for (const item of orderData.basketItems) {
//         if (item.variantId) {
//           await db.productVariant.update({
//             where: { id: item.variantId },
//             data: { stockQty: { decrement: item.qty } },
//           });
//         }
//       }
//     }

//     return res.status(201).json({ success: true, data: iyziResponse });
//   } catch (err) {
//     console.error("Hata:", err);
//     return res.status(400).json({ success: false, error: err });
//   }
// }
