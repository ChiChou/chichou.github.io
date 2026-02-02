import { getPaginatedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 10;

export default function BlogPage() {
  const { posts, totalPages } = getPaginatedPosts(1, POSTS_PER_PAGE);

  return (
    <main className="max-w-2xl lg:max-w-5xl mx-auto px-4 pb-16 min-h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath="/blog" />
    </main>
  );
}
