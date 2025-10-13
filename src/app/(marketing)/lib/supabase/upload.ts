// app/(marketing)/lib/supabase/upload.ts
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file);
    if (error) throw error;

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Supabase upload error:", err);
    throw new Error("Görsel yüklenemedi. Lütfen tekrar deneyin.");
  }
}
