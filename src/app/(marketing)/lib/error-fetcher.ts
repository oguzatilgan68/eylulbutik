// lib/api.ts
export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data?.error || "Beklenmedik bir hata oluştu");
    (error as any).status = res.status; // 429, 500 vb.
    throw error;
  }

  return res.json();
}
