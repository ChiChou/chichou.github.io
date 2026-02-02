export const config = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export function resolveImageUrl(src: string): string {
  if (!src) return "";

  // Already absolute URL (http/https/data)
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  // Ensure path starts with /
  const normalizedPath = src.startsWith("/") ? src : `/${src}`;

  // Prepend base path if configured
  return `${config.basePath}${normalizedPath}`;
}

const OPTIMIZED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

export function getOptimizedSources(
  src: string,
): { avif: string; webp: string; fallback: string } | null {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  if (!src) return null;

  // Skip external URLs
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return null;
  }

  const ext = src.substring(src.lastIndexOf(".")).toLowerCase();
  if (!OPTIMIZED_EXTENSIONS.includes(ext)) {
    return null;
  }

  const basePath = src.substring(0, src.lastIndexOf("."));

  // Transform paths: /img/ -> /image/, /talks/covers/ -> /talks/image/
  const transformedPath = basePath
    .replace(/^\/?img\//, "/image/")
    .replace(/^\/?talks\/covers\//, "/talks/image/");

  return {
    avif: resolveImageUrl(`${transformedPath}.avif`),
    webp: resolveImageUrl(`${transformedPath}.webp`),
    fallback: resolveImageUrl(`${transformedPath}.jpg`),
  };
}
