import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { Prisma } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = search
    ? {
        OR: [
          {
            orderNo: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            user: {
              is: {
                fullName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }
    : {};

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total });
}
