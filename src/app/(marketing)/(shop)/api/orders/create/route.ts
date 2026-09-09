import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { z } from "zod";

// Gelen veriyi doğrulamak için Zod şeması
const createOrderSchema = z.object({
  addressId: z.string().uuid("Geçersiz adres ID"),
  userId: z.string().min(1, "Kullanıcı ID gereklidir"),
  // İsteğe bağlı indirim veya toplam bilgileri gelebilir
  total: z.number().positive().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validasyon
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { addressId, userId } = validation.data;

    // 2. Kullanıcının adresini veritabanından çek (Sipariş anında adres değişse bile siparişte sabit kalması için)
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Teslimat adresi bulunamadı" },
        { status: 404 }
      );
    }

    // 3. Kullanıcının aktif sepetini ve sepet ürünlerini çek
    const cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Sepetiniz boş veya bulunamadı" },
        { status: 400 }
      );
    }

    // 4. Ara toplam ve toplam tutarları hesapla
    let subtotal = 0;
    for (const item of cart.items) {
      const price = Number(item.unitPrice);
      subtotal += price * item.qty;
    }

    const shippingTotal = 0; // İsteğe göre kargo ücreti eklenebilir
    const taxTotal = 0;      // İsteğe göre vergi eklenebilir
    const total = subtotal + shippingTotal + taxTotal;

    // Benzersiz bir Sipariş Numarası üret (Örn: EYU-1725867492000)
    const orderNo = `EYU-${Date.now().toString().slice(-8)}`;

    // 5. Transaction ile güvenli sipariş oluşturma ve sepeti temizleme
    const order = await db.$transaction(async (tx) => {
      // A. Siparişi oluştur
      const newOrder = await tx.order.create({
        data: {
          orderNo,
          userId,
          status: "PENDING", // Ödeme yapılana veya EFT onaylanana kadar PENDING
          subtotal,
          shippingTotal,
          taxTotal,
          total,
          currency: "TRY",
          // Adres bilgilerini siparişe kopyala (Adres sonradan silinse bile siparişte kalsın)
          addressTitle: address.title,
          addressFullName: address.fullName,
          addressPhone: address.phone,
          addressCity: address.city,
          addressDistrict: address.district,
          addressNeighbourhood: address.neighbourhood,
          addressDetail: address.address1,
          addressZip: address.zip,
          // Sepetteki ürünleri OrderItem olarak ekle
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              name: item.product.name,
              qty: item.qty,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      // B. Stok düşme işlemleri (İsteğe bağlı, varyant veya ürün stoklarından düşülebilir)
      for (const item of cart.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQty: { decrement: item.qty } },
          });
        }
      }

      // C. Sepeti temizle (CartItem'ları sil)
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNo: order.orderNo,
        total: Number(order.total),
        message: "Sipariş başarıyla oluşturuldu.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Order create error:", err);
    return NextResponse.json(
      { error: "Sipariş oluşturulurken bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}