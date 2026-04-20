import type { Element, Root, Text } from "hast";

import { compile, run } from "@mdx-js/mdx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import * as runtime from "react/jsx-runtime";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { createHighlighter } from "shiki";
import { SKIP, visit } from "unist-util-visit";

import { mdxComponents } from "@/components/mdx-components";
import { OptimizedImage } from "@/components/optimized-image";
import { getOptimizedSources, resolveImageUrl } from "@/lib/config";
import {
  getAdjacentPosts,
  getPostBySlug,
  getPublishedPostSlugs,
} from "@/lib/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post.published) {
      return { title: "Post Not Found" };
    }
    const metadata: Metadata = {
      title: post.title,
      description: post.desc,
    };
    if (post.image) {
      const imageUrl = resolveImageUrl(post.image);
      metadata.openGraph = {
        title: post.title,
        description: post.desc,
        type: "article",
        publishedTime: post.date,
        images: [{ url: imageUrl }],
      };
      metadata.twitter = {
        card: "summary_large_image",
        title: post.title,
        description: post.desc,
        images: [imageUrl],
      };
    }
    return metadata;
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "python",
        "bash",
        "shell",
        "json",
        "yaml",
        "markdown",
        "css",
        "html",
        "c",
        "cpp",
        "rust",
        "go",
        "swift",
        "objective-c",
        "tcl",
        "xml",
      ],
    });
  }
  return highlighter;
}

function rehypeShiki() {
  return async (tree: Root) => {
    const hl = await getHighlighter();

    visit(tree, "element", (node: Element) => {
      if (
        node.tagName === "pre" &&
        node.children?.[0] &&
        (node.children[0] as Element).tagName === "code"
      ) {
        const codeNode = node.children[0] as Element;
        const className = (codeNode.properties?.className as string[]) || [];
        const langMatch = className.find((c) => c.startsWith("language-"));
        const lang = langMatch?.replace("language-", "") || "text";

        const textNode = codeNode.children?.[0] as Text | undefined;
        const codeText = textNode?.value || "";

        try {
          const html = hl.codeToHtml(codeText.trim(), {
            lang: hl.getLoadedLanguages().includes(lang) ? lang : "text",
            theme: "github-dark",
          });

          (node as unknown as { type: string; value: string }).type = "raw";
          (node as unknown as { type: string; value: string }).value = html;
        } catch {
          // Keep original if highlighting fails
        }
      }
    });
  };
}

function rehypeImageUrls() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "img" && node.properties?.src) {
        const src = node.properties.src as string;
        const alt = (node.properties.alt as string) || "";

        // Try to use optimized images with <picture>
        const optimized = getOptimizedSources(src);

        if (optimized && parent && typeof index === "number") {
          // Transform the img node into a picture node in-place
          const imgChild: Element = {
            type: "element",
            tagName: "img",
            properties: {
              src: optimized.fallback,
              alt,
              loading: "lazy",
            },
            children: [],
          };

          // Mutate the current node to become a picture element
          node.tagName = "picture";
          node.properties = {};
          node.children = [
            {
              type: "element",
              tagName: "source",
              properties: {
                srcSet: optimized.avif,
                type: "image/avif",
              },
              children: [],
            },
            {
              type: "element",
              tagName: "source",
              properties: {
                srcSet: optimized.webp,
                type: "image/webp",
              },
              children: [],
            },
            imgChild,
          ];

          // Skip visiting children to prevent infinite recursion
          return SKIP;
        } else {
          // Non-optimizable format, just resolve the URL
          node.properties.src = resolveImageUrl(src);
          node.properties.loading = "lazy";
        }
      }

      // Unwrap standalone images/pictures from <p> tags
      if (node.tagName === "p" && node.children.length === 1) {
        const child = node.children[0] as Element;
        if (
          child.type === "element" &&
          (child.tagName === "img" || child.tagName === "picture")
        ) {
          if (parent && typeof index === "number") {
            const wrapper: Element = {
              type: "element",
              tagName: "div",
              properties: {
                className: "my-8 -mx-4 md:-mx-16 lg:-mx-24",
              },
              children: [child],
            };
            (parent.children as Element[])[index] = wrapper;
            child.properties.className = "w-full h-full";
          }
        }
      }
    });
  };
}

function rehypeYouTubeEmbed() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      // Find <p> tags that contain only a YouTube embed link
      if (node.tagName === "p" && node.children.length === 1) {
        const child = node.children[0] as Element;
        if (
          child.type === "element" &&
          child.tagName === "a" &&
          child.properties?.href &&
          typeof child.properties.href === "string" &&
          child.properties.href.startsWith("https://www.youtube.com/embed/")
        ) {
          const src = child.properties.href;

          // Replace the <p> with a wrapper div containing iframe
          const embedNode: Element = {
            type: "element",
            tagName: "div",
            properties: {
              className: "my-8 -mx-4 md:-mx-16 lg:-mx-24",
            },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: {
                  className: "aspect-video",
                },
                children: [
                  {
                    type: "element",
                    tagName: "iframe",
                    properties: {
                      src,
                      className: "w-full h-full",
                      allow:
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                      allowFullScreen: true,
                    },
                    children: [],
                  },
                ],
              },
            ],
          };

          if (parent && typeof index === "number") {
            (parent.children as Element[])[index] = embedNode;
          }
        }
      }
    });
  };
}

async function compileMDX(source: string) {
  const code = await compile(source, {
    format: "md",
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeRaw,
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeShiki,
      rehypeImageUrls,
      rehypeYouTubeEmbed,
    ],
  });

  const { default: MDXContent } = await run(String(code), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return MDXContent;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
    if (!post.published) {
      notFound();
    }
  } catch {
    notFound();
  }

  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { prev, next } = await getAdjacentPosts(slug);

  const MDXContent = await compileMDX(post.content);

  return (
    <>
      {/* Hero Section */}
      {post.image && (
        <ViewTransition name={`post-image-${slug}`}>
          <div className="relative w-full aspect-video lg:aspect-auto lg:h-[40vh] lg:min-h-100">
            <OptimizedImage
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="max-w-2xl mx-auto">
                <div className="inline-block px-4 py-3 rounded-lg">
                  <time className="text-sm text-white/80">{date}</time>
                  <ViewTransition name={`post-title-${slug}`}>
                    <h1 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight text-white">
                      {post.title}
                    </h1>
                  </ViewTransition>
                </div>
              </div>
            </div>
          </div>
        </ViewTransition>
      )}

      {/* Fallback header when no image */}
      {!post.image && (
        <header className="max-w-2xl mx-auto px-4 pt-8 pb-4">
          <time className="text-sm text-muted-foreground">{date}</time>
          <ViewTransition name={`post-title-${slug}`}>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {post.title}
            </h1>
          </ViewTransition>
        </header>
      )}

      <main className="max-w-2xl mx-auto px-4 pb-16">
        <article>
          <div className="prose-custom pt-8">
            <MDXContent components={mdxComponents} />
          </div>
        </article>
      </main>

      {/* Prev/Next Navigation */}
      {(prev || next) && (
        <nav className="max-w-4xl mx-auto px-4 pb-16">
          <div className="pt-8 border-t border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {prev ? (
                <Link
                  href={`/posts/${prev.slug}/`}
                  className="group flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  transitionTypes={['slide-back']}
                >
                  {prev.image && (
                    <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                      <OptimizedImage
                        src={prev.image}
                        alt={prev.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-xs text-muted-foreground">
                      Previous
                    </span>
                    <h3 className="mt-1 font-medium line-clamp-2 group-hover:text-muted-foreground transition-colors">
                      {prev.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/posts/${next.slug}/`}
                  className="group flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors sm:flex-row-reverse sm:text-right"
                  transitionTypes={['slide-forward']}
                >
                  {next.image && (
                    <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                      <OptimizedImage
                        src={next.image}
                        alt={next.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-xs text-muted-foreground">
                      Next
                    </span>
                    <h3 className="mt-1 font-medium line-clamp-2 group-hover:text-muted-foreground transition-colors">
                      {next.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
