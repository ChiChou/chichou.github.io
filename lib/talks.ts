import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const talksDirectory = path.join(process.cwd(), "_talks");

async function findCover(slug: string): Promise<string | undefined> {
  const baseName = `${slug}-slides`;
  const srcDir = path.join(process.cwd(), "_talks", "covers");
  const jpgPath = path.join(srcDir, `${baseName}.jpg`);
  try {
    await fs.access(jpgPath);
    return `/talks/covers/${baseName}.jpg`;
  } catch {
    return undefined;
  }
}

export interface TalkLinks {
  event?: string;
  slides?: string;
  paper?: string;
  recording?: string;
  parody?: string;
}

export interface Talk {
  slug: string;
  title: string;
  conference: string;
  year: number;
  speakers: string[];
  links: TalkLinks;
  cover?: string;
}

export async function getTalkSlugs(): Promise<string[]> {
  const files = await fs.readdir(talksDirectory);
  return files.filter((file) => file.endsWith(".md"));
}

export async function getTalkBySlug(slug: string): Promise<Talk> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(talksDirectory, `${realSlug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "",
    conference: data.conference || "",
    year: data.year || 0,
    speakers: data.speakers || [],
    links: data.links || {},
    cover: await findCover(realSlug),
  };
}

export async function getAllTalks(): Promise<Talk[]> {
  const slugs = await getTalkSlugs();
  const talks = await Promise.all(slugs.map((slug) => getTalkBySlug(slug)));
  return talks.sort((a, b) => b.year - a.year);
}
