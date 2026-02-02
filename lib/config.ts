export const config = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export function resolveImageUrl(src: string): string {
  if (!src) return "";

  // Already absolute URL (http/https/data)
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  // Ensure path starts with /
  const normalizedPath = src.startsWith("/") ? src : `/${src}`;

  // Prepend base path if configured
  return `${config.basePath}${normalizedPath}`;
}
