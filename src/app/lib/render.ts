import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRewrite from "rehype-rewrite";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

import { addBasePath } from "./env";

import type { Root, Element, RootContent } from "hast";

const OPTIMIZED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

function getOptimizedSources(src: string): { avif: string; webp: string } | null {
  const ext = src.substring(src.lastIndexOf(".")).toLowerCase();
  if (!OPTIMIZED_EXTENSIONS.includes(ext)) {
    return null;
  }

  // Optimized images are in /image/ not /img/
  const basePath = src.substring(0, src.lastIndexOf(".")).replace(/^img\//, "image/");
  return {
    avif: `${basePath}.avif`,
    webp: `${basePath}.webp`,
  };
}

function rewrite(
  node: Root | RootContent,
  index?: number,
  parent?: Root | Element,
): void {
  if (node.type !== "element") return;

  if (node.tagName === "a" && node.properties) {
    const { href } = node.properties as { href?: string };
    if (href?.startsWith("http")) {
      const url = new URL(href);
      if (url.hostname === "www.youtube.com") {
        node.tagName = "iframe";
        node.properties.className = "w-full aspect-video";
        node.properties.src = url.toString();
        node.properties.frameBorder = "0";
        node.properties.allow = `accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture`;
        node.properties.allowFullscreen = true;
        delete node.properties.href;
      } else {
        // todo: handle gists.github.com
        node.properties.target = "_blank";
        node.properties.rel = "noopener noreferrer";
      }
    }
  }

  if (node.tagName === "img" && node.properties && parent && typeof index === "number") {
    const { src, alt } = node.properties as { src?: string; alt?: string };
    if (src && !src.startsWith("http")) {
      const optimized = getOptimizedSources(src);

      if (optimized) {
        // Replace img with picture element
        const pictureElement: Element = {
          type: "element",
          tagName: "picture",
          properties: {},
          children: [
            {
              type: "element",
              tagName: "source",
              properties: {
                srcSet: addBasePath(optimized.avif),
                type: "image/avif",
              },
              children: [],
            },
            {
              type: "element",
              tagName: "source",
              properties: {
                srcSet: addBasePath(optimized.webp),
                type: "image/webp",
              },
              children: [],
            },
            {
              type: "element",
              tagName: "img",
              properties: {
                src: addBasePath(src),
                alt: alt || "",
                loading: "lazy",
              },
              children: [],
            },
          ],
        };

        // Replace the img node with picture element in parent
        parent.children[index] = pictureElement;
      } else {
        // Non-optimizable format, just add base path
        node.properties.src = addBasePath(src);
      }
    }
  }
}

export default async function md2html(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeRewrite, { rewrite })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}
