import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const db = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Toplam kategori sayısı (pagination için)
    const totalCount = await db.category.count({
      where: { parentId: null },
    });

    const categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      include: {
        children: {
          orderBy: { name: "asc" },
        },
      },
      skip,
      take: limit,
    });

    // parentName ekle
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl || null,
      parentName: null, // üst kategori yok
      children: cat.children.map((child) => ({
        id: child.id,
        name: child.name,
        imageUrl: child.imageUrl || null,
        parentName: cat.name,
      })),
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      categories: formattedCategories,
      totalPages,
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Kategoriler yüklenemedi" },
      { status: 500 }
    );
  }
}
