"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleNext = () => setLightboxIdx((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setLightboxIdx((prev) => (prev - 1 + images.length) % images.length);
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [lightboxOpen]);
  const renderImage = (img: any, className = "object-cover") => (
    <Image
      src={img.url}
      alt={img.alt || "Ürün görseli"} // SEO için alt tag
      fill
      className={className}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );

  const THUMB_CLASS = "rounded-lg border-2 transition-all flex-shrink-0";

  return (
    <>
      {/* Ana Görsel */}
      <div className="flex flex-col gap-4">
        <div
          className="relative aspect-[3/4] max-h-[500px] w-full overflow-hidden rounded-xl border dark:border-gray-700 group cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomPos({ x: 50, y: 50 })}
          onClick={() => {
            setLightboxOpen(true);
            setLightboxIdx(selectedImageIdx);
          }}
        >
          {images[selectedImageIdx] ? (
            renderImage(
              images[selectedImageIdx],
              "object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            )
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              Görsel Yok
            </div>
          )}
        </div>

        {/* Thumbnail */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIdx(idx)}
              className={`${THUMB_CLASS} ${
                selectedImageIdx === idx
                  ? "border-pink-500 shadow"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <Image
                src={img.url}
                width={80}
                height={80}
                alt={img.alt || "Ürün küçük görseli"} // SEO destekli
                className="object-cover w-16 h-16 lg:w-20 lg:h-20"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center px-4">
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
            aria-label="Lightbox Kapat"
          >
            ×
          </button>

          {/* Lightbox Ana Görsel */}
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            {renderImage(images[lightboxIdx], "object-contain max-h-full")}
          </div>

          {/* Prev / Next */}
          {/* Prev / Next Butonları */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-50 text-white text-4xl font-bold bg-black bg-opacity-30 p-2 rounded-full"
                aria-label="Önceki Görsel"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-50 text-white text-4xl font-bold bg-black bg-opacity-30 p-2 rounded-full"
                aria-label="Sonraki Görsel"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
