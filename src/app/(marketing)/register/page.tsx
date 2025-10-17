"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "../components/ui/loading";
import { log } from "../lib/logger";
import { Eye, EyeOff } from "lucide-react";

// ✅ Zod şema
const registerSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalı"),
  email: z.string().email("Geçerli bir email giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  phone: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [backendError, setBackendError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setBackendError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    if (res.ok) {
      await log(`User registered: ${data.email}`, "info", {
        email: data.email,
      });
      router.push("/login");
    } else {
      await log(`Registration failed for email: ${data.email}`, "warn", {
        email: data.email,
      });
      setBackendError(result.error || "Kayıt sırasında hata oluştu");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Kayıt Ol
        </h1>

        {/* Backend hatası */}
        {backendError && <p className="text-red-500 mb-4">{backendError}</p>}

        {/* Full Name */}
        <input
          type="text"
          placeholder="Ad Soyad"
          {...register("fullName")}
          className="w-full p-3 mb-2 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mb-2">{errors.fullName.message}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full p-3 mb-2 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        <div className="relative w-full mb-2">
          <input
            type={showPassword ? "text" : "password"} // 👈 şifre görünür/gizli
            placeholder="Şifre"
            {...register("password")}
            className="w-full p-3 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none pr-10" // ikon için padding
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {/* Phone */}
        <input
          type="text"
          placeholder="Telefon (opsiyonel)"
          {...register("phone")}
          className="w-full p-3 mb-4 rounded border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded text-white flex items-center justify-center transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {isSubmitting ? <Loading /> : "Kayıt Ol"}
        </button>

        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
          Hesabınız var mı?{" "}
          <Link href="/login" className="text-pink-500 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </form>
    </div>
  );
}
