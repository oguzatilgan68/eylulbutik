import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 1. PostgreSQL adaptörünü bağlantı dizesi ile başlatıyoruz
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL! 
});

// 2. PrismaClient'a adaptörü ve log ayarlarını veriyoruz
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;