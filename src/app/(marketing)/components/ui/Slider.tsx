"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type SliderType = "PROMOTION" | "PRODUCT" | "CATEGORY";

type Product = { id: string; name: string; slug?: string };

type Slider = {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  link: string;
  type: SliderType;
  products?: Product[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SliderComponent() {
  const router = useRouter();
  const { data: sliders, isLoading } = useSWR<Slider[]>(
    "/api/sliders",
    fetcher
  );
  const [current, setCurrent] = useState(0);

  // Otomatik geçiş
  useEffect(() => {
    if (!sliders || sliders.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  // 🔄 Skeleton görünümü (yüklenme sırasında)
  if (isLoading || !sliders)
    return (
      <section className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg mt-8 animate-pulse">
        <div className="relative w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12">
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"
            />
          ))}
        </div>
      </section>
    );

  if (!sliders || sliders.length === 0) return null;

  const slide = sliders[current];

  return (
    <section className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg mt-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="relative w-full h-64 md:h-96 cursor-pointer"
          onClick={() => router.push(slide.link)}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Slider Görseli */}
          <Image
            src={slide.imageUrl}
            alt={slide.title || "Slider Görseli"}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
          />

          {/* Metin katmanı */}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/40 flex flex-col justify-center items-start p-6 md:p-12 text-white z-20">
            {slide.title && (
              <motion.h2
                key={slide.title}
                className="text-xl md:text-3xl font-bold drop-shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {slide.title}
              </motion.h2>
            )}
            {slide.subtitle && (
              <motion.p
                key={slide.subtitle}
                className="mt-2 text-sm md:text-lg text-gray-100 max-w-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {slide.subtitle}
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {sliders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current
                ? "bg-blue-600 scale-110"
                : "bg-white/60 dark:bg-gray-400/50 hover:bg-blue-400"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
