import Link from "next/link";
import { ViewTransition } from "react";

import { OptimizedImage } from "@/components/optimized-image";
import type { PostMeta } from "@/lib/posts";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${post.slug}`} className="group block" transitionTypes={['slide-up']}>
      {/* Mobile: overlay layout — no view-transition-name to avoid duplicates with desktop */}
      <article className="sm:hidden relative aspect-video overflow-hidden rounded-xl">
        {post.image && (
          <>
            <OptimizedImage
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          </>
        )}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
          <time className="text-sm opacity-80">{date}</time>
          <h2 className="mt-1 text-lg font-medium line-clamp-2">
            {post.title}
          </h2>
          {post.desc && (
            <p className="mt-1 text-sm opacity-80 line-clamp-2">{post.desc}</p>
          )}
        </div>
      </article>

      {/* Desktop: side by side layout */}
      <article className="hidden sm:flex sm:flex-row gap-5 2xl:gap-6 p-3 -m-3 rounded-xl transition-colors group-hover:bg-muted/50">
        {post.image && (
          <ViewTransition name={`post-image-${post.slug}`}>
            <div className="sm:w-52 2xl:w-72 sm:shrink-0 aspect-video rounded-lg overflow-hidden">
              <OptimizedImage
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </ViewTransition>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <time className="text-sm 2xl:text-base text-muted-foreground tracking-wide uppercase">{date}</time>
          <ViewTransition name={`post-title-${post.slug}`}>
            <h2 className="mt-1.5 text-xl 2xl:text-2xl font-semibold transition-colors line-clamp-2">
              {post.title}
            </h2>
          </ViewTransition>
          {post.desc && (
            <p className="mt-2 text-muted-foreground text-base 2xl:text-lg line-clamp-2 leading-relaxed">
              {post.desc}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
