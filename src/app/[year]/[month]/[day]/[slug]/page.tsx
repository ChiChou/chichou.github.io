import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { all, get } from "@/app/lib/posts";
import md2html from "@/app/lib/render";

import markdownStyles from "@/app/markdown.module.css";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MarkdownEnhancements } from "@/components/markdown-enhancements";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { addBasePath, getOptimizedImageSources } from "@/app/lib/env";

type Params = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await all();
  return posts.map(({ y, m, d, slug }) => ({
    year: y,
    month: m,
    day: d,
    slug: slug,
  }));
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const { year, month, day, slug } = params;
  const post = await get(year, month, day, slug).catch(() => null);

  if (!post) {
    return notFound();
  }

  const title = `${post.data.title} | CodeColorist`;

  return {
    metadataBase: new URL("https://codecolor.ist"), // todo: move to process.env
    title,
    description: post.data.desc,
    openGraph: {
      title,
      images: [addBasePath(post.data.image)],
    },
  };
}

export default async function Post({ params }: Params) {
  const p = await params;
  const post = await get(p.year, p.month, p.day, p.slug).catch(() => null);
  if (!post) {
    notFound();
  }

  const html = await md2html(post.content);
  const imageUrl = addBasePath(post.data.image);
  const optimized = getOptimizedImageSources(post.data.image);

  const renderHeroImage = () => {
    if (process.env.NODE_ENV === "development") {
      return (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
      );
    }
    if (optimized) {
      return (
        <picture>
          <source srcSet={optimized.avif} type="image/avif" />
          <source srcSet={optimized.webp} type="image/webp" />
          <img
            src={optimized.original}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          />
        </picture>
      );
    }
    return (
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />
    );
  };

  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Header />

      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {renderHeroImage()}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 pt-4 z-10">
          <div className="container mx-auto px-4 md:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-gray-300 hover:text-white">
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/posts/page/1"
                      className="text-gray-300 hover:text-white"
                    >
                      Posts
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto px-4 md:px-8 md:text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
              {post.data.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">{`${p.year}-${p.month}-${p.day}`}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center py-10 overflow-visible">
        <div className="container w-full prose dark:prose-invert px-4 md:px-8 overflow-visible">
          <MarkdownEnhancements>
            <div
              className={markdownStyles["markdown"]}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </MarkdownEnhancements>
        </div>
      </main>

      <Footer />
    </div>
  );
}
