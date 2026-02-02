import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "_posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  image: string;
  desc: string;
  published: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(postsDirectory);
  return files.filter((file) => file.endsWith(".md"));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "",
    date: data.date ? new Date(data.date).toISOString() : "",
    image: data.image || "",
    desc: data.desc || "",
    published: data.published !== false,
    content,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));
  return posts
    .filter((post) => post.published)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      image: post.image,
      desc: post.desc,
      published: post.published,
    }))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => ({
      slug: slug.replace(/\.md$/, ""),
      published: (await getPostBySlug(slug)).published,
    }))
  );
  return posts.filter((p) => p.published).map((p) => p.slug);
}

export async function getPaginatedPosts(
  page: number,
  perPage: number
): Promise<{ posts: PostMeta[]; totalPages: number }> {
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / perPage);
  const start = (page - 1) * perPage;
  const posts = allPosts.slice(start, start + perPage);
  return { posts, totalPages };
}

export async function getAdjacentPosts(slug: string): Promise<{
  prev: PostMeta | null;
  next: PostMeta | null;
}> {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // Posts are sorted by date descending, so:
  // - prev (older) is at currentIndex + 1
  // - next (newer) is at currentIndex - 1
  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return { prev, next };
}
