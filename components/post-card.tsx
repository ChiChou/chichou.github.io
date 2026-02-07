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
    <Link href={`/posts/${post.slug}`} className="group block">
      {/* Mobile: overlay layout — no view-transition-name to avoid duplicates with desktop */}
      <article className="sm:hidden relative aspect-video overflow-hidden">
        {post.image && (
          <>
            <OptimizedImage
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
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
      <article className="hidden sm:flex sm:flex-row gap-6 2xl:gap-8">
        {post.image && (
          <ViewTransition name={`post-image-${post.slug}`}>
            <div className="sm:w-48 2xl:w-64 sm:shrink-0 aspect-video">
              <OptimizedImage
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </ViewTransition>
        )}
        <div className="flex-1 min-w-0">
          <time className="text-sm 2xl:text-base text-muted-foreground">{date}</time>
          <ViewTransition name={`post-title-${post.slug}`}>
            <h2 className="mt-1 text-lg 2xl:text-xl font-medium group-hover:text-muted-foreground transition-colors line-clamp-2">
              {post.title}
            </h2>
          </ViewTransition>
          {post.desc && (
            <p className="mt-2 text-muted-foreground text-sm 2xl:text-base line-clamp-2">
              {post.desc}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
