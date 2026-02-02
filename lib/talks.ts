import fs from "fs";
import path from "path";
import matter from "gray-matter";

const talksDirectory = path.join(process.cwd(), "_talks");
const coversDirectory = path.join(process.cwd(), "public/talks/covers");

function findCover(slug: string): string | undefined {
  // Check if processed cover exists (webp preferred)
  const baseName = `${slug}-slides`;
  const webpPath = path.join(coversDirectory, `${baseName}.webp`);
  if (fs.existsSync(webpPath)) {
    return `/talks/covers/${baseName}`;
  }
  return undefined;
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

export function getTalkSlugs(): string[] {
  return fs.readdirSync(talksDirectory).filter((file) => file.endsWith(".md"));
}

export function getTalkBySlug(slug: string): Talk {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(talksDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "",
    conference: data.conference || "",
    year: data.year || 0,
    speakers: data.speakers || [],
    links: data.links || {},
    cover: findCover(realSlug),
  };
}

export function getAllTalks(): Talk[] {
  const slugs = getTalkSlugs();
  const talks = slugs
    .map((slug) => getTalkBySlug(slug))
    .sort((a, b) => b.year - a.year);
  return talks;
}
