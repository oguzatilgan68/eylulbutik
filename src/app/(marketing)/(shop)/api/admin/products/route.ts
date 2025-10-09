import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const brandId = searchParams.get("brandId") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
    const sortField = searchParams.get("sortField") || "name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
    const where: any = {};
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    if (status) where.status = status;
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;

    if (minPrice || maxPrice) {
      where.OR = where.OR || [];
      where.OR.push({
        variants: {
          some: {
            price: {
              gte: minPrice || undefined,
              lte: maxPrice || undefined,
            },
          },
        },
      });
      where.OR.push({
        price: {
          gte: minPrice || undefined,
          lte: maxPrice || undefined,
        },
      });
    }

    const totalItems = await db.product.count({ where });

    const items = await db.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        images: true,
        variants: true,
      },
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        { error: "Silinecek ürün ID'leri gönderilmedi." },
        { status: 400 }
      );
    }

    await db.product.deleteMany({
      where: { id: { in: body.ids } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Silme işlemi başarısız." },
      { status: 500 }
    );
  }
}
