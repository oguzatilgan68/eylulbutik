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
import { FiUserPlus } from "react-icons/fi";

const registerSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
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

    try {
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
    } catch (err) {
      setBackendError("Beklenmeyen bir hata oluştu.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 sm:p-10 w-full max-w-md border border-gray-100 dark:border-gray-800 space-y-5"
      >
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FiUserPlus size={22} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Aramıza Katılın
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Eylül Butik dünyasını keşfetmek için hesap oluşturun.
          </p>
        </div>

        {backendError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold border border-rose-200 dark:border-rose-900">
            {backendError}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Ad Soyad *
            </label>
            <input
              type="text"
              placeholder="Adınız Soyadınız"
              {...register("fullName")}
              className={inputClass}
            />
            {errors.fullName && (
              <p className="text-rose-500 text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              E-posta Adresi *
            </label>
            <input
              type="email"
              placeholder="ornek@email.com"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && (
              <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Şifre *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="En az 6 karakter"
                {...register("password")}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Telefon Numarası (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="5XXXXXXXXX"
              {...register("phone")}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? <Loading /> : "Kayıt Ol"}
        </button>

        <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-pink-600 dark:text-pink-400 font-semibold hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}