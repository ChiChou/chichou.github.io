import { getPaginatedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 10;

export default function Home() {
  const { posts, totalPages } = getPaginatedPosts(1, POSTS_PER_PAGE);

  return (
    <main className="max-w-2xl mx-auto px-4 pb-16">
      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} />
    </main>
  );
}
