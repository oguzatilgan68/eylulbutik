import { 
  PrismaClient, 
  Role, 
  ProductStatus, 
  OrderStatus, 
  PaymentStatus, 
  TransferStatus, 
  ShippingProvider, 
  ShipmentStatus, 
  CouponType, 
  SliderType, 
  ReturnStatus, 
  ReturnReason, 
  RefundStatus, 
  RefundReason 
} from '../src/generated/prisma'; // Prisma client yolunuza göre güncelleyin
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...');

  // 1. Eski verileri temizle (İlişki sırasına göre)
  // 1. Eski verileri temizle (İlişki sırasına göre - Çocuk tablolardan ebeveyn tablolara)
  await prisma.log.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.returnItem.deleteMany();
  await prisma.returnRequest.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bankTransferNotification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  
  // Önce variant ve ürünlerin alt tabloları temizlenmeli:
  await prisma.productVariantAttribute.deleteMany();
  await prisma.variantImage.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productProperty.deleteMany();
  
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  
  await prisma.attributeValue.deleteMany();
  await prisma.attributeType.deleteMany();
  await prisma.propertyValue.deleteMany();
  await prisma.propertyType.deleteMany();
  
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.slider.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.genericData.deleteMany();

  console.log('🧹 Eski veriler temizlendi.');

  // 2. Generic Data (Site Ayarları)
  await prisma.genericData.create({
    data: {
      brandName: 'Butik Modeli E-Ticaret',
      phone: '+90 850 123 45 67',
      email: 'destek@butikmodel.com',
      address: 'Merkez Mah. Moda Sok. No: 15, Kadıköy / İstanbul',
      instagramUrl: 'https://instagram.com/butikmodel',
      facebookUrl: 'https://facebook.com/butikmodel',
      description: 'En şık ve trend kıyafetlerin adresi.',
    },
  });

  // 3. Markalar
  const brandsData = ['Mavi', 'Zara', 'LC Waikiki', 'Koton', 'Defacto', 'Nike', 'Adidas', 'Puma', 'Mango', 'Pierre Cardin'];
  const createdBrands = [];
  for (const bName of brandsData) {
    const brand = await prisma.brand.create({
      data: { name: bName, logoUrl: `https://picsum.photos/seed/${bName.toLowerCase()}/200/200` },
    });
    createdBrands.push(brand);
  }

  // 4. Kategoriler
  const rootCategory = await prisma.category.create({
    data: { name: 'Giyim', slug: 'giyim', imageUrl: 'https://picsum.photos/seed/giyim/400/400' },
  });

  const subCategoriesData = [
    { name: 'Elbise', slug: 'elbise' },
    { name: 'Pantolon', slug: 'pantolon' },
    { name: 'Tişört', slug: 'tisort' },
    { name: 'Mont & Kaban', slug: 'mont-kaban' },
    { name: 'Ayakkabı', slug: 'ayakkabi' },
  ];

  const createdCategories = [];
  for (const sub of subCategoriesData) {
    const cat = await prisma.category.create({
      data: {
        name: sub.name,
        slug: sub.slug,
        parentId: rootCategory.id,
        imageUrl: `https://picsum.photos/seed/${sub.slug}/400/400`,
      },
    });
    createdCategories.push(cat);
  }

  // 5. Özellik ve Varyant Tipleri (Beden ve Renk)
  const colorAttrType = await prisma.attributeType.create({
    data: {
      name: 'Renk',
      values: {
        create: [{ value: 'Siyah' }, { value: 'Beyaz' }, { value: 'Mavi' }, { value: 'Kırmızı' }, { value: 'Bej' }],
      },
    },
    include: { values: true },
  });

  const sizeAttrType = await prisma.attributeType.create({
    data: {
      name: 'Beden',
      values: {
        create: [{ value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL' }, { value: '38' }, { value: '40' }],
      },
    },
    include: { values: true },
  });

  // 6. 70 Kullanıcı Oluşturma
  const users = [];
  // 1 Admin, 69 Müşteri
  for (let i = 1; i <= 70; i++) {
    const role: Role = i === 1 ? Role.ADMIN : Role.CUSTOMER;

    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        fullName: `Kullanıcı Adı ${i}`,
        phone: `+90532${String(1000000 + i).slice(1)}`,
        role: role,
        emailVerified: true,
        passwordHash: '$2b$10$EpVxhLVsowixW2p3w867C.jT/6bK5jW7b/uQzUqJ5m8Zp5X8vj5q2', // şifre: 123456
        addresses: {
          create: [
            {
              title: 'Ev',
              fullName: `Kullanıcı Adı ${i}`,
              phone: `+90532${String(1000000 + i).slice(1)}`,
              city: 'İstanbul',
              district: 'Kadıköy',
              neighbourhood: 'Moda Mah.',
              address1: 'Atatürk Cad. No: 10 Daire: 5',
              zip: '34710',
              isDefault: true,
            },
          ],
        },
      },
      include: { addresses: true },
    });
    users.push(user);
  }

  // 7. 100 Ürün Oluşturma (Varyantlı ve Varyantsız)
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const brand = createdBrands[i % createdBrands.length];
    const category = createdCategories[i % createdCategories.length];
    const hasVariants = i % 2 === 0; // Çift numaralılar varyantlı

    const product = await prisma.product.create({
      data: {
        name: `Trend Ürün Modeli #${i}`,
        slug: `trend-urun-modeli-${i}-${Date.now()}`,
        seoTitle: `Trend Ürün Modeli #${i} - En Uygun Fiyatlar`,
        seoKeywords: ['moda', 'giyim', 'trend', `urun${i}`],
        brandId: brand.id,
        categoryId: category.id,
        price: hasVariants ? null : Number((Math.random() * 1500 + 100).toFixed(2)),
        currency: 'TRY',
        status: ProductStatus.PUBLISHED,
        inStock: true,
        changeable: true,
        images: {
          create: [
            { url: `https://picsum.photos/seed/prod${i}a/600/600`, order: 0 },
            { url: `https://picsum.photos/seed/prod${i}b/600/600`, order: 1 },
          ],
        },
      },
      include: { images: true },
    });

    if (hasVariants) {
      // Varyant ekle (Örn: Siyah-S, Beyaz-M)
      const colorVal = colorAttrType.values[i % colorAttrType.values.length];
      const sizeVal = sizeAttrType.values[i % sizeAttrType.values.length];

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `SKU-PROD-${i}-${colorVal.value}-${sizeVal.value}`,
          price: Number((Math.random() * 1500 + 100).toFixed(2)),
          stockQty: Math.floor(Math.random() * 50) + 5,
          barcode: `86800000${i}99`,
          attributes: {
            create: [
              { attributeValueId: colorVal.id },
              { attributeValueId: sizeVal.id },
            ],
          },
        },
      });
    }

    products.push(product);
  }

  // Tüm varyantları çekelim siparişlerde kullanmak için
  const allVariants = await prisma.productVariant.findMany();

  // 8. Sliderlar, Kuponlar
  await prisma.slider.createMany({
    data: [
      { title: 'Büyük Sezon İndirimi', subtitle: '%50’ye varan indirimler', imageUrl: 'https://picsum.photos/seed/slide1/1200/400', link: '/kategori/giyim', type: SliderType.PROMOTION, order: 1 },
      { title: 'Yeni Sezon Ürünleri', subtitle: 'Stoklarda yerini aldı', imageUrl: 'https://picsum.photos/seed/slide2/1200/400', link: '/kategori/elbise', type: SliderType.CATEGORY, order: 2 },
    ],
  });

  await prisma.coupon.createMany({
    data: [
      { code: 'HOSGELDIN10', type: CouponType.PERCENT, value: 10, isActive: true },
      { code: 'INDİRİM100', type: CouponType.FIXED, value: 100, isActive: true },
    ],
  });

  // 9. 50 Yorum Oluşturma
  for (let i = 1; i <= 50; i++) {
    const randomUser = users[i % users.length];
    const randomProduct = products[i % products.length];

    try {
      await prisma.review.create({
        data: {
          productId: randomProduct.id,
          userId: randomUser.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 veya 5 yıldız
          content: `Harika bir ürün, kalitesine bayıldım! #${i}`,
          isApproved: true,
        },
      });
    } catch (e) {
      // Aynı kullanıcı aynı ürüne birden fazla yorum yapmasın unique kısıtı için
    }
  }

  // 10. 80 Sipariş ve İlişkili Veriler (Ödeme, Kargo, İade vb.)
  const customerUsers = users.filter((u) => u.role === Role.CUSTOMER);

  for (let i = 1; i <= 80; i++) {
    const user = customerUsers[i % customerUsers.length];
    const address = user.addresses[0];
    const randomProduct = products[i % products.length];
    
    // Varyantı var mı kontrol et
    const variant = allVariants.find((v) => v.productId === randomProduct.id);
    const unitPrice = variant ? Number(variant.price) : Number(randomProduct.price || 250);

    const subtotal = unitPrice * 2;
    const total = subtotal + 30; // Kargo dahil

    const orderStatusList = [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.FULFILLED, OrderStatus.CANCELLED];
    const status = orderStatusList[i % orderStatusList.length];

    const order = await prisma.order.create({
      data: {
        orderNo: `ORD-2026-${String(1000 + i)}`,
        userId: user.id,
        phone: user.phone,
        status: status,
        addressTitle: address?.title || 'Ev',
        addressFullName: address?.fullName || user.fullName,
        addressPhone: address?.phone || user.phone,
        addressCity: address?.city || 'İstanbul',
        addressDistrict: address?.district || 'Kadıköy',
        addressNeighbourhood: address?.neighbourhood || 'Moda',
        addressDetail: address?.address1 || 'Sokak No: 1',
        addressZip: address?.zip || '34710',
        subtotal: subtotal,
        shippingTotal: 30,
        total: total,
        currency: 'TRY',
        items: {
          create: [
            {
              productId: randomProduct.id,
              variantId: variant ? variant.id : null,
              name: randomProduct.name,
              qty: 2,
              unitPrice: unitPrice,
            },
          ],
        },
        payment: {
          create: {
            merchantOid: `MERCH-${i}-${Date.now()}`,
            amount: Math.round(total * 100),
            currency: 'TL',
            status: status === OrderStatus.PAID || status === OrderStatus.FULFILLED ? 'success' : 'pending',
          },
        },
        shipment: {
          create: {
            provider: ShippingProvider.YURTICI,
            trackingNo: `TRK${Math.floor(Math.random() * 1000000000)}`,
            status: status === OrderStatus.FULFILLED ? ShipmentStatus.DELIVERED : ShipmentStatus.PENDING,
          },
        },
      },
    });

    // Bazı siparişlere havale bildirimi ekleyelim (Örn: Her 5 siparişte bir)
    if (i % 5 === 0) {
      await prisma.bankTransferNotification.create({
        data: {
          orderId: order.id,
          userId: user.id,
          senderName: user.fullName,
          bankName: 'Garanti BBVA',
          amount: total,
          status: TransferStatus.APPROVED,
          note: 'Havale yapıldı, onay bekliyor.',
        },
      });
    }

    // Bazı siparişlere iade talebi ekleyelim (Örn: Her 10 siparişte bir)
    if (i % 10 === 0 && status === OrderStatus.FULFILLED) {
      const orderItem = await prisma.orderItem.findFirst({ where: { orderId: order.id } });
      if (orderItem) {
        await prisma.returnRequest.create({
          data: {
            orderId: order.id,
            userId: user.id,
            status: ReturnStatus.PENDING,
            comment: 'Bedeni büyük geldiği için iade etmek istiyorum.',
            items: {
              create: [
                {
                  orderItemId: orderItem.id,
                  qty: 1,
                  reason: ReturnReason.DONTLIKE_ITEM,
                  status: ReturnStatus.PENDING,
                },
              ],
            },
          },
        });
      }
    }
  }

  console.log('✅ Seed işlemi başarıyla tamamlandı!');
  console.log('📊 Özet: 70 Kullanıcı, 100 Ürün, 50 Yorum ve 80 Sipariş başarıyla oluşturuldu.');
}

main()
  .catch((e) => {
    console.error('❌ Seed sırasında hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });