import type { Element, Root, Text } from "hast";

import { compile, run } from "@mdx-js/mdx";
import type { Metadata } from "next";
import Image from "next/image";
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
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/posts";
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

async function compileMDX(source: string) {
  const code = await compile(source, {
    format: "md",
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeRaw, rehypeSlug, rehypeAutolinkHeadings, rehypeShiki],
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
  const imageSrc = post.image.startsWith("/") ? post.image : `/${post.image}`;
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const MDXContent = await compileMDX(post.content);

  return (
    <main className="max-w-2xl mx-auto px-4 pb-16 xl:max-w-5xl">
      <div className="xl:grid xl:grid-cols-[1fr_200px] xl:gap-8">
        <article className="max-w-2xl">
          {post.image && (
            <div className="-mx-4 md:-mx-16 lg:-mx-24 mb-8">
              <Image
                src={imageSrc}
                alt={post.title}
                width={1600}
                height={900}
                sizes="(min-width: 1280px) 896px, (min-width: 768px) 100vw, 100vw"
                className="w-full h-auto"
                priority
              />
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
        </article>

        <aside className="hidden xl:block">
          <TableOfContents items={toc} />
        </aside>
      </div>
    </main>
  );
}
