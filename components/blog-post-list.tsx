import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import type { PostMeta } from "@/lib/posts";

interface BlogPostListProps {
  posts: PostMeta[];
  currentPage: number;
  totalPages: number;
}

export function BlogPostList({ posts, currentPage, totalPages }: BlogPostListProps) {
  return (
    <main className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 2xl:gap-10">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </main>
  );
}
