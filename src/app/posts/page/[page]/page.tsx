import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { all } from "@/app/lib/posts";
import { Header } from "@/components/header";
import { addBasePath, getOptimizedImageSources } from "@/app/lib/env";
import { Footer } from "@/components/footer";

const perPage = 9;

export async function generateStaticParams() {
  const posts = await all();
  const pages = Math.ceil(posts.length / perPage);
  return Array.from({ length: pages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

type Params = {
  params: Promise<{
    page: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { page } = await props.params;
  const title = `CodeColorist | Blog Page ${page}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default async function Page({ params }: Params) {
  const p = await params;
  const page = parseInt(p.page, 10);

  const posts = await all();
  const max = Math.ceil(posts.length / perPage);
  if (isNaN(page) || page < 1 || page > max + 1) {
    notFound();
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedPosts = posts.slice(start, end);

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {paginatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/${post.y}/${post.m}/${post.d}/${post.slug}`}
                  className="group block h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-gray-900/50 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    {(() => {
                      if (process.env.NODE_ENV === "development") {
                        return (
                          <Image
                            src={addBasePath(post.data.image)}
                            alt={post.data.title}
                            width={600}
                            height={400}
                            className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        );
                      }
                      const optimized = getOptimizedImageSources(
                        post.data.image
                      );
                      if (optimized) {
                        return (
                          <picture>
                            <source
                              srcSet={optimized.avif}
                              type="image/avif"
                            />
                            <source
                              srcSet={optimized.webp}
                              type="image/webp"
                            />
                            <img
                              src={optimized.original}
                              alt={post.data.title}
                              className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </picture>
                        );
                      }
                      return (
                        <img
                          src={addBasePath(post.data.image)}
                          alt={post.data.title}
                          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      );
                    })()}
                  </div>
                  <div className="p-5">
                    <time className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {`${post.y}-${post.m}-${post.d}`}
                    </time>
                    <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.data.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {post.data.desc}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {max > 1 && (
            <nav className="mt-12 flex justify-center">
              <ol className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-gray-900 p-1 shadow-sm">
                {Array.from({ length: max }, (_, i) => (
                  <li key={i + 1}>
                    <Link
                      href={`/posts/page/${i + 1}`}
                      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors ${
                        i + 1 === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
