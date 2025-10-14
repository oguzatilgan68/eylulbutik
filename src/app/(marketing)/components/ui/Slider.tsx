"use client";

import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  if (isLoading || !sliders)
    return (
      <section className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg mt-8 animate-pulse">
        <div className="relative w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </section>
    );

  if (!sliders || sliders.length === 0) return null;

  const slide = sliders[current];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  // 🔄 Kaydırma (drag) sonrası yön tayini
  const handleDragEnd = (
    _: any,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const swipePower = Math.abs(info.offset.x) * info.velocity.x;
    if (swipePower < -1000) nextSlide(); // sola kaydırma → sonraki
    if (swipePower > 1000) prevSlide(); // sağa kaydırma → önceki
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg mt-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="relative w-full h-64 md:h-96 cursor-pointer"
          onClick={() => router.push(slide.link)}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Görsel */}
          <Image
            src={slide.imageUrl}
            alt={slide.title || "Slider Görseli"}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
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

      {/* Sol/Sağ Butonlar — sadece md ve üstü cihazlarda görünür */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-30 transition"
        aria-label="Önceki"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-30 transition"
        aria-label="Sonraki"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination (sadece gösterim) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {sliders.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current
                ? "bg-blue-600 scale-110"
                : "bg-white/60 dark:bg-gray-400/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
