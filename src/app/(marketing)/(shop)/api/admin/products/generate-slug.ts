import { db } from "@/app/(marketing)/lib/db";
import slugify from "slugify";

export async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await db.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}