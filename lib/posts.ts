import fs from "fs";
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

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
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

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
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
  return posts;
}

export function getPublishedPostSlugs(): string[] {
  return getPostSlugs()
    .map((slug) => slug.replace(/\.md$/, ""))
    .filter((slug) => getPostBySlug(slug).published);
}

export function getPaginatedPosts(
  page: number,
  perPage: number
): { posts: PostMeta[]; totalPages: number } {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / perPage);
  const start = (page - 1) * perPage;
  const posts = allPosts.slice(start, start + perPage);
  return { posts, totalPages };
}

export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const allPosts = getAllPosts();
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
