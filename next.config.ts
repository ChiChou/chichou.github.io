import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

// build GitHub Pages url
// when repo is owber.github.io, no basePath or assetPrefix is set

const ownerAndRepo = process.env.GITHUB_REPOSITORY;

if (typeof ownerAndRepo === "string") {
  const [owner, repo] = ownerAndRepo.split("/", 2);
  if (repo.toLowerCase() !== `${owner.toLocaleLowerCase()}.github.io`) {
    nextConfig.basePath = `/${repo}`;
  }
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
