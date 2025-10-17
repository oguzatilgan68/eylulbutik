export type LogLevel = "info" | "warn" | "error";

export async function log(
  message: string,
  level: LogLevel = "info",
  meta: Record<string, any> = {},
  status?: number,
  stack?: string
) {
  const logData = {
    message,
    level,
    status,
    stack,
    meta: {
      ...meta,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      page: typeof window !== "undefined" ? window.location.href : "unknown",
    },
    createdAt: new Date(),
  };

  // Geliştirme ortamında console log
  if (process.env.NODE_ENV === "development") {
    console[level](logData);
  }

  // API Route üzerinden log kaydı
  try {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
  } catch (err) {
    console.error("🛑 Frontend log gönderilemedi:", err);
  }
}
