"use client";

import { useState, useEffect, useRef } from "react";

import { getOptimizedSources, resolveImageUrl } from "@/lib/config";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [canZoom, setCanZoom] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const imageSrc = resolveImageUrl(src);
  const optimized = getOptimizedSources(src);

  useEffect(() => {
    const isSvg = src.toLowerCase().endsWith(".svg");
    if (isSvg) {
      const timeoutId = setTimeout(() => setCanZoom(true), 0);
      return () => clearTimeout(timeoutId);
    }

    const img = new window.Image();
    img.onload = () => {
      setCanZoom(img.naturalWidth > 600);
    };
    img.src = imageSrc;
  }, [src, imageSrc]);

  if (isZoomed) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
        onClick={() => setIsZoomed(false)}
      >
        {optimized ? (
          <picture>
            <source srcSet={optimized.avif} type="image/avif" />
            <source srcSet={optimized.webp} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </picture>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        )}
      </div>
    );
  }

  return (
    <span className="block my-8 -mx-4 md:-mx-16 lg:-mx-24">
      {optimized ? (
        <picture>
          <source srcSet={optimized.avif} type="image/avif" />
          <source srcSet={optimized.webp} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            loading="lazy"
            className={`w-full h-auto ${canZoom ? "cursor-zoom-in" : ""}`}
            onClick={() => canZoom && setIsZoomed(true)}
          />
        </picture>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className={`w-full h-auto ${canZoom ? "cursor-zoom-in" : ""}`}
          onClick={() => canZoom && setIsZoomed(true)}
        />
      )}
    </span>
  );
}
