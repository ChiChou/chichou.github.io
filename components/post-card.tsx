import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const imageSrc = post.image.startsWith("/") ? post.image : `/${post.image}`;
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {post.image && (
          <div className="sm:w-48 sm:flex-shrink-0">
            <img
              src={imageSrc}
              alt={post.title}
              className="w-full h-32 sm:h-28 object-cover"
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
