import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPaginatedPosts, getAllPosts, POSTS_PER_PAGE } from "@/lib/posts";
import { BlogPostList } from "@/components/blog-post-list";

export const metadata: Metadata = {
  title: "Blog | CodeColorist",
};

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

  const { posts, totalPages } = await getPaginatedPosts(
    pageNum,
    POSTS_PER_PAGE,
  );

  if (pageNum > totalPages) {
    notFound();
  }

  return <BlogPostList posts={posts} currentPage={pageNum} totalPages={totalPages} />;
}
