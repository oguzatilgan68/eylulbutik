"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiMaximize2, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface ProductImagesProps {
  images: { url: string; alt?: string }[];
  selectedImageIdx: number;
  setSelectedImageIdx: (idx: number) => void;
}

export default function ProductImages({
  images,
  selectedImageIdx,
  setSelectedImageIdx,
}: ProductImagesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Klavye ve Scroll Kilidi
  useEffect(() => {
    if (!lightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, images?.length]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-3/4 w-full rounded-3xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm">
        Görsel Bulunamadı
      </div>
    );
  }

  // Lightbox Modal: Doğrudan document.body'ye bağlanır
  const lightboxModal = lightboxOpen && mounted ? (
    createPortal(
      <div
        onClick={() => setLightboxOpen(false)}
        className="fixed inset-0 z-999999 w-screen h-dvh bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none touch-none overflow-hidden"
      >
        {/* Üst Kısım: Sayaç ve Kapatma Butonu */}
        <div className="relative w-full flex items-center justify-between z-1000000 shrink-0">
          <div className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold tracking-widest backdrop-blur-md">
            {lightboxIdx + 1} / {images.length}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition cursor-pointer backdrop-blur-md"
            aria-label="Kapat"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Orta Kısım: Tam Sığdırılan Görsel */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex-1 w-full min-h-0 my-2 flex items-center justify-center"
        >
          <div className="relative w-full h-full max-w-5xl">
            <Image
              src={images[lightboxIdx].url}
              alt={images[lightboxIdx].alt || "Tam ekran görsel"}
              fill
              sizes="100vw"
              className="object-contain pointer-events-none"
              priority
            />
          </div>
        </div>

        {/* İleri / Geri Yön Butonları */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-1000000 p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition cursor-pointer backdrop-blur-md"
              aria-label="Önceki"
            >
              <FiChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-1000000 p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition cursor-pointer backdrop-blur-md"
              aria-label="Sonraki"
            >
              <FiChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </>
        )}

        {/* Alt Kısım: Boşluk dengeleyici (Mobilde adres çubuğu güvenli alanı) */}
        <div className="h-2 shrink-0 pointer-events-none" />
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row gap-4 w-full items-start">
        {/* Küçük Thumbnail Şeridi */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto w-full sm:w-20 max-h-125 scrollbar-none shrink-0 py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  selectedImageIdx === idx
                    ? "border-pink-600 shadow-md ring-2 ring-pink-500/20 scale-[1.02]"
                    : "border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Ürün görseli ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Ana Büyük Görsel */}
        <div className="relative flex-1 w-full aspect-3/4 max-h-155 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 group shadow-sm">
          <Image
            src={images[selectedImageIdx].url}
            alt={images[selectedImageIdx].alt || "Ürün ana görseli"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover cursor-pointer transition-transform duration-500 ease-out group-hover:scale-105"
            onClick={() => {
              setLightboxIdx(selectedImageIdx);
              setLightboxOpen(true);
            }}
          />

          <button
            type="button"
            onClick={() => {
              setLightboxIdx(selectedImageIdx);
              setLightboxOpen(true);
            }}
            className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-700 dark:text-gray-200 shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Büyük Boyut Gör"
            aria-label="Tam ekran aç"
          >
            <FiMaximize2 size={18} />
          </button>
        </div>
      </div>

      {lightboxModal}
    </>
  );
}