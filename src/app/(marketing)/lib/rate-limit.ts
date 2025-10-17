// lib/rate-limit.ts
import getRateLimitMiddlewares from "next-rate-limit";

export const { checkNext } = getRateLimitMiddlewares({
  interval: 60 * 1000, // 1 dakika
  uniqueTokenPerInterval: 500, // 500 istek
});
