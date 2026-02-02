export const config = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

function isRemote(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  );
}

export function resolveImageUrl(src: string): string {
  if (!src) return "";

  // Already absolute URL (http/https/data)
  if (isRemote(src)) return src;

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
  if (isRemote(src)) return null;

  const ext = src.substring(src.lastIndexOf(".")).toLowerCase();
  if (!OPTIMIZED_EXTENSIONS.includes(ext)) {
    return null;
  }

  const basePath = src.substring(0, src.lastIndexOf("."));

  return {
    avif: resolveImageUrl(`${basePath}.avif`),
    webp: resolveImageUrl(`${basePath}.webp`),
    fallback: resolveImageUrl(`${basePath}.${ext.substring(1)}`),
  };
}
