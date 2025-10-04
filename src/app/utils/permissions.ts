import { PrismaClient } from "@/generated/prisma";


const prisma = new PrismaClient();

/**
 * Kullanıcının belirli bir tablo ve işlemi gerçekleştirme yetkisini kontrol eder.
 * @param userId Kullanıcının ID'si
 * @param resource Hangi tabloya yetki kontrolü yapılacak? (örn: 'Post', 'Service')
 * @param action Kullanıcının yapmak istediği işlem (CREATE, READ, UPDATE, DELETE)
 * @returns Kullanıcının izni olup olmadığına dair boolean değer
 */
export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) return false;

  return user.role.permissions.some(
    (perm: any) => perm.resource === resource && perm.action === action
  );
}
