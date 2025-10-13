"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { redirect } from "next/navigation";

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
  const { data: sliders } = useSWR<Slider[]>("/api/sliders", fetcher);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliders && sliders.length > 0) {
        setCurrent((prev) => (prev + 1) % sliders.length);
      }
    }, 5000); // 5 saniye geçiş
    return () => clearInterval(interval);
  }, [sliders]);

  if (!sliders || sliders.length === 0) return null;

  const slide = sliders[current];

  return (
    <section className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg mt-8">
      {/* Slider Görseli */}
      <div
        className="relative w-full h-64 md:h-96"
        onClick={() => redirect(`${slide.link}`)}
      >
        <Image
          src={slide.imageUrl}
          alt={slide.title || "Slider Görseli"}
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,..."
        />

        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 flex flex-col justify-center items-start p-6 md:p-12 text-white z-20">
          {slide.title && (
            <h2 className="text-xl md:text-3xl font-bold">{slide.title}</h2>
          )}
          {slide.subtitle && (
            <p className="mt-2 text-sm md:text-lg">{slide.subtitle}</p>
          )}
        </div>
      </div>

      {/* Slider Pagination */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {sliders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition ${
              idx === current
                ? "bg-blue-600"
                : "bg-white/50 dark:bg-gray-300/50"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
