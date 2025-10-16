// types/ReturnRequestWithRelations.ts
import { ReturnRequest, ReturnItem, User } from "@/generated/prisma";

export interface ReturnRequestWithRelations extends ReturnRequest {
  user: User | null;
  items: (ReturnItem & {
    orderItem: {
      id: string;
      name: string;
      product: {
        id: string;
        name: string;
        images: { url: string; alt?: string | null }[];
      };
      variant: any | null;
    };
  })[];
  refunds: any[];
}
