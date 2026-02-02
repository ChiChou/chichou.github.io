import Link from "next/link";

import { resolveImageUrl } from "@/lib/config";
import type { PostMeta } from "@/lib/posts";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const imageSrc = resolveImageUrl(post.image);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      {/* Mobile: overlay layout */}
      <article className="sm:hidden relative aspect-video overflow-hidden">
        {post.image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        )}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
          <time className="text-sm opacity-80">{date}</time>
          <h2 className="mt-1 text-lg font-medium line-clamp-2">
            {post.title}
          </h2>
          {post.desc && (
            <p className="mt-1 text-sm opacity-80 line-clamp-2">
              {post.desc}
            </p>
          )}
        </div>
      </article>

      {/* Desktop: side by side layout */}
      <article className="hidden sm:flex sm:flex-row gap-6">
        {post.image && (
          <div className="sm:w-48 sm:flex-shrink-0 aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <time className="text-sm text-muted-foreground">{date}</time>
          <h2 className="mt-1 text-lg font-medium group-hover:text-muted-foreground transition-colors line-clamp-2">
            {post.title}
          </h2>
          {post.desc && (
            <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
              {post.desc}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
