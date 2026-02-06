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
    <main className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8 pb-16 min-h-[calc(100vh-80px)] flex flex-col lg:justify-center">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 2xl:gap-12">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </main>
  );
}
