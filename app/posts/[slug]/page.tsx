import type { Element, Root, Text } from "hast";

import { compile, run } from "@mdx-js/mdx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { createHighlighter } from "shiki";
import { visit } from "unist-util-visit";

import { mdxComponents } from "@/components/mdx-components";
import { TableOfContents } from "@/components/toc";
import { resolveImageUrl } from "@/lib/config";
import {
  getAdjacentPosts,
  getPostBySlug,
  getPublishedPostSlugs,
} from "@/lib/posts";
import { extractToc } from "@/lib/toc";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    if (!post.published) {
      return { title: "Post Not Found" };
    }
    return {
      title: post.title,
      description: post.desc,
    };
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
        node.properties.src = resolveImageUrl(src);
      }

      // Unwrap standalone images from <p> tags so ZoomableImage can apply negative margins
      if (node.tagName === "p" && node.children.length === 1) {
        const child = node.children[0] as Element;
        if (child.type === "element" && child.tagName === "img") {
          if (parent && typeof index === "number") {
            (parent.children as Element[])[index] = child;
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
    post = getPostBySlug(slug);
    if (!post.published) {
      notFound();
    }
  } catch {
    notFound();
  }

  const toc = extractToc(post.content);
  const imageSrc = resolveImageUrl(post.image);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { prev, next } = getAdjacentPosts(slug);

  const MDXContent = await compileMDX(post.content);

  return (
    <main className="max-w-2xl mx-auto px-4 pb-16 xl:max-w-5xl">
      <div className="xl:grid xl:grid-cols-[1fr_200px] xl:gap-8">
        <article className="max-w-2xl">
          {post.image && (
            <div className="-mx-4 md:-mx-16 lg:-mx-24 mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          <header className="mb-8">
            <time className="text-sm text-muted-foreground">{date}</time>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose-custom">
            <MDXContent components={mdxComponents} />
          </div>

          {/* Prev/Next Navigation */}
          {(prev || next) && (
            <nav className="mt-16 pt-8 border-t border-muted">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/posts/${prev.slug}/`}
                    className="group flex gap-4 p-4 -m-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {prev.image && (
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveImageUrl(prev.image)}
                          alt={prev.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
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
                    className="group flex gap-4 p-4 -m-4 rounded-lg hover:bg-muted/50 transition-colors sm:flex-row-reverse sm:text-right"
                  >
                    {next.image && (
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveImageUrl(next.image)}
                          alt={next.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
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
            </nav>
          )}
        </article>

        <aside className="hidden xl:block">
          <TableOfContents items={toc} />
        </aside>
      </div>
    </main>
  );
}
