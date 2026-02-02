"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [canZoom, setCanZoom] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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
    img.src = src.startsWith("/") ? src : `/${src}`;
  }, [src]);

  const imageSrc = src.startsWith("/") ? src : `/${src}`;

  if (isZoomed) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
        onClick={() => setIsZoomed(false)}
      >
        <Image
          src={imageSrc}
          alt={alt}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    );
  }

  return (
    <span className="block my-8 -mx-4 md:-mx-16 lg:-mx-24">
      <Image
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-auto ${canZoom ? "cursor-zoom-in" : ""}`}
        onClick={() => canZoom && setIsZoomed(true)}
      />
    </span>
  );
}
