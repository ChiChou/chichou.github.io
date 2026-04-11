import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const posts = await getAllPosts();
  const feedUrl = `${SITE_URL}${BASE_PATH}/feed.xml`;
  const siteUrl = `${SITE_URL}${BASE_PATH}/`;
  const lastBuildDate = new Date(posts[0]?.date || Date.now()).toUTCString();

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}${BASE_PATH}/posts/${post.slug}/`;
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.desc || "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodeColorist</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Security Research mainly on macOS / iOS</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
