import { notFound } from "next/navigation";
import { getPaginatedPosts, getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 10;

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export default async function PaginatedPage({ params }: PageProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    notFound();
  }

  const { posts, totalPages } = getPaginatedPosts(pageNum, POSTS_PER_PAGE);

  if (pageNum > totalPages) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pb-16">
      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={pageNum} totalPages={totalPages} />
    </main>
  );
}
