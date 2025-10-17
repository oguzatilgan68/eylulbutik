"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "../components/ui/loading";
import { log } from "../lib/logger";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Geçerli bir email giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        await log(`Login successful for email: ${data.email}`, "info", {
          email: data.email,
        });
      }
      if (!res.ok) {
        await log(`Login failed for email: ${data.email}`, "warn", {
          email: data.email,
        });
        throw new Error(result.error || "Giriş başarısız");
      }
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      console.error(err);
    }
  };

  const inputClass =
    "mt-1 block p-2 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-pink-500 focus:border-pink-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Giriş Yap
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-3">
          <span className="text-gray-700 dark:text-gray-200">Email</span>
          <input type="email" {...register("email")} className={inputClass} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </label>

        <label className="block mb-4 relative">
          <span className="text-gray-700 dark:text-gray-200">Şifre</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // 👈 Şifre görünür/gizli
              {...register("password")}
              className={`${inputClass} pr-10`} // ikon için sağ boşluk
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-md transition-colors cursor-pointer ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600 text-white"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            "Giriş Yap"
          )}
        </button>

        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-pink-500 hover:underline">
            Kayıt Ol
          </Link>
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
          Şifrenizi mi unuttunuz?{" "}
          <Link
            href="/request-password-reset"
            className="text-pink-500 hover:underline"
          >
            Şifre Sıfırlama
          </Link>
        </p>
      </form>
    </div>
  );
}
