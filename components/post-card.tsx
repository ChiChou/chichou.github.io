import Link from "next/link";
import { ViewTransition } from "react";

import { OptimizedImage } from "@/components/optimized-image";
import type { PostMeta } from "@/lib/posts";

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group block lg:col-span-12"
        transitionTypes={["slide-up"]}
      >
        <article className="relative aspect-[21/9] max-lg:aspect-video overflow-hidden rounded-2xl">
          {post.image && (
            <>
              <ViewTransition name={`post-image-${post.slug}`}>
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </ViewTransition>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-cyber/0 group-hover:bg-cyber/5 transition-colors duration-500" />
            </>
          )}
          <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-10 text-white">
            <time className="text-sm lg:text-base opacity-70 tracking-wide uppercase">
              {date}
            </time>
            <ViewTransition name={`post-title-${post.slug}`}>
              <h2 className="mt-2 text-2xl lg:text-4xl 2xl:text-5xl font-bold leading-tight max-w-4xl">
                {post.title}
              </h2>
            </ViewTransition>
            {post.desc && (
              <p className="mt-3 text-base lg:text-xl opacity-80 max-w-2xl line-clamp-2">
                {post.desc}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-cyber font-medium">
              <span>Read article</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block lg:col-span-6"
      transitionTypes={["slide-up"]}
    >
      {/* Mobile: overlay layout */}
      <article className="lg:hidden relative aspect-video overflow-hidden rounded-xl">
        {post.image && (
          <>
            <OptimizedImage
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        )}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
          <time className="text-sm opacity-80">{date}</time>
          <h2 className="mt-1 text-lg font-medium line-clamp-2">{post.title}</h2>
          {post.desc && (
            <p className="mt-1 text-sm opacity-80 line-clamp-2">{post.desc}</p>
          )}
        </div>
      </article>

      {/* Desktop: overlay layout */}
      <article className="hidden lg:block relative aspect-[4/3] 2xl:aspect-video overflow-hidden rounded-xl">
        {post.image && (
          <>
            <ViewTransition name={`post-image-${post.slug}`}>
              <OptimizedImage
                src={post.image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </ViewTransition>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-cyber/0 group-hover:bg-cyber/10 transition-colors duration-300" />
          </>
        )}
        <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
          <time className="text-sm opacity-70 tracking-wide uppercase">
            {date}
          </time>
          <ViewTransition name={`post-title-${post.slug}`}>
            <h2 className="mt-1.5 text-xl 2xl:text-2xl font-semibold line-clamp-2">
              {post.title}
            </h2>
          </ViewTransition>
          {post.desc && (
            <p className="mt-2 text-sm 2xl:text-base opacity-80 line-clamp-2 leading-relaxed">
              {post.desc}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
