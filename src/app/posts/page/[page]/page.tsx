import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import { all } from "@/app/lib/posts";
import { Header } from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  const title = `All Posts, Page ${page} | CodeColorist`;

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
    <div className="font-sans min-h-screen">
      <Header />

      <div className="container mx-auto">
        <Breadcrumb className="m-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Posts Page {page}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4">
        <ul className="grid 2xl:grid-cols-3 md:grid-cols-2 gap-10 list-none p-0">
          {paginatedPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${post.y}/${post.m}/${post.d}/${post.slug}`}
                className="block hover:underline"
              >
                {(() => {
                  const optimized = getOptimizedImageSources(post.data.image);
                  if (optimized) {
                    return (
                      <picture>
                        <source srcSet={optimized.avif} type="image/avif" />
                        <source srcSet={optimized.webp} type="image/webp" />
                        <img
                          src={optimized.original}
                          alt={post.data.title}
                          className="w-full aspect-video object-cover rounded-lg"
                          loading="lazy"
                        />
                      </picture>
                    );
                  }
                  return (
                    <img
                      src={addBasePath(post.data.image)}
                      alt={post.data.title}
                      className="w-full aspect-video object-cover rounded-lg"
                      loading="lazy"
                    />
                  );
                })()}
                <h2 className="text-2xl font-medium line-clamp-2 my-6">
                  {post.data.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  {post.data.desc}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {`${post.y}-${post.m}-${post.d}`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <footer className="container mx-auto my-20">
        <ol className="flex justify-center gap-4">
          {Array.from({ length: max }, (_, i) => (
            <li key={i + 1}>
              <Link
                href={`/posts/page/${i + 1}`}
                className={`px-4 py-2 rounded transition-colors dark:text-gray-50 text-gray-400 ${
                  i + 1 === page
                    ? "dark:bg-gray-900 bg-gray-50"
                    : "dark:bg-gray-700 bg-gray-100"
                } dark:hover:bg-gray-600 hover:bg-gray-200`}
              >
                {i + 1}
              </Link>
            </li>
          ))}
        </ol>
      </footer>

      <Footer />
    </div>
  );
}
