import type { Metadata } from "next";
import { getPaginatedPosts, POSTS_PER_PAGE } from "@/lib/posts";
import { BlogPostList } from "@/components/blog-post-list";

export const metadata: Metadata = {
  title: "Blog | CodeColorist",
};

export default async function BlogPage() {
  const { posts, totalPages } = await getPaginatedPosts(1, POSTS_PER_PAGE);

  return <BlogPostList posts={posts} currentPage={1} totalPages={totalPages} />;
}
