import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPaginatedPosts, getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: "Blog | CodeColorist",
};

const POSTS_PER_PAGE = 10;

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const allPosts = await getAllPosts();
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

  const { posts, totalPages } = await getPaginatedPosts(pageNum, POSTS_PER_PAGE);

  if (pageNum > totalPages) {
    notFound();
  }

  return (
    <main className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8 pb-16 min-h-[calc(100vh-80px)] flex flex-col lg:justify-center">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 2xl:gap-12">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <Pagination currentPage={pageNum} totalPages={totalPages} basePath="/blog" />
    </main>
  );
}
