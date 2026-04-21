import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import type { PostMeta } from "@/lib/posts";

interface BlogPostListProps {
  posts: PostMeta[];
  currentPage: number;
  totalPages: number;
}

export function BlogPostList({ posts, currentPage, totalPages }: BlogPostListProps) {
  const showMoreCard = currentPage === 1 && totalPages > 1;

  return (
    <main className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {posts.map((post, index) => (
          <PostCard
            key={post.slug}
            post={post}
            featured={currentPage === 1 && index === 0}
          />
        ))}
        {showMoreCard && (
          <Link
            href="/blog/page/2"
            className="group hidden lg:block lg:col-span-6"
          >
            <article className="relative aspect-video lg:aspect-[4/3] 2xl:aspect-video overflow-hidden rounded-xl bg-muted/50 border border-border/50 hover:border-border hover:bg-muted transition-all">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-1" />
                <span className="text-lg font-medium">More posts</span>
              </div>
            </article>
          </Link>
        )}
      </div>
      {currentPage > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
      )}
    </main>
  );
}
