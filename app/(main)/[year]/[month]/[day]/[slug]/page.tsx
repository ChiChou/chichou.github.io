import { redirect } from "next/navigation";

import { getPublishedPostSlugs } from "@/lib/posts";

interface OldPostRedirectProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();

  return slugs
    .map((fullSlug) => {
      const match = fullSlug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
      if (!match) return null;

      const [, year, month, day, slug] = match;
      return { year, month, day, slug };
    })
    .filter(Boolean);
}

export default async function OldPostRedirect({
  params,
}: OldPostRedirectProps) {
  const { year, month, day, slug } = await params;
  const newPath = `/posts/${year}-${month}-${day}-${slug}`;
  redirect(newPath);
}
