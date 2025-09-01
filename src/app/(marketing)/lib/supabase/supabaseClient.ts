// Supabase Client'ı oluşturmak için bir fonksiyon
export function createClient() {
  if (typeof window !== "undefined") {
    // Eğer bu client-side bir işlemse (Tarayıcıda çalışıyorsa)
    const { createClient } = require("@supabase/supabase-js");

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
}
