import { forwardRef } from "react";

import { resolveImageUrl, getOptimizedSources } from "@/lib/config";

interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  alt: string;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  function OptimizedImage({ src, alt, ...props }, ref) {
    const imageSrc = resolveImageUrl(src);
    const optimized = getOptimizedSources(src);

    if (optimized) {
      return (
        <picture>
          <source srcSet={optimized.avif} type="image/avif" />
          <source srcSet={optimized.webp} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={ref} src={optimized.fallback} alt={alt} {...props} />
        </picture>
      );
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} src={imageSrc} alt={alt} {...props} />;
  }
);
