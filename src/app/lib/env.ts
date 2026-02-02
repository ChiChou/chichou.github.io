function getBasePath() {
  const ownerAndRepo = process.env.GITHUB_REPOSITORY;
  if (typeof ownerAndRepo === "string") {
    const [owner, repo] = ownerAndRepo.split("/", 2);
    if (repo !== `${owner}.github.io`) {
      return `/${repo}`;
    }
  }

  return "";
}

export const basePath = getBasePath();

export function addBasePath(path: string) {
  let prefixed = path;
  if (!prefixed.startsWith("/")) prefixed = `/${prefixed}`;
  return basePath + prefixed;
}

const OPTIMIZED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

export function getOptimizedImageSources(src: string): {
  avif: string;
  webp: string;
  original: string;
} | null {
  const ext = src.substring(src.lastIndexOf(".")).toLowerCase();
  if (!OPTIMIZED_EXTENSIONS.includes(ext)) {
    return null;
  }

  // Optimized images are in /image/ not /img/
  const optimizedBase = src
    .substring(0, src.lastIndexOf("."))
    .replace(/^img\//, "image/");
  return {
    avif: addBasePath(`${optimizedBase}.avif`),
    webp: addBasePath(`${optimizedBase}.webp`),
    original: addBasePath(src),
  };
}
