import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";

export async function getAuthUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}