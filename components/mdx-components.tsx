"use client";

import type { MDXComponents } from "mdx/types";

import { ZoomableImage } from "./zoomable-image";
import { CopyButton } from "./copy-button";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const element = node as { props?: { children?: React.ReactNode } };
    return extractText(element.props?.children);
  }
  return "";
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-12 mb-4" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold mt-8 mb-3" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="my-4 leading-7" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code className="px-1.5 py-0.5 bg-muted text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => {
    const codeText = extractText(children);

    return (
      <div className="relative my-8 -mx-4 md:-mx-16 lg:-mx-24">
        <CopyButton text={codeText} />
        <pre
          className="overflow-x-auto p-4 text-sm [&>code]:bg-transparent [&>code]:p-0"
          {...props}
        >
          {children}
        </pre>
      </div>
    );
  },
  img: ({ src, alt }) => {
    if (!src) return null;
    return <ZoomableImage src={src} alt={alt || ""} />;
  },
  hr: () => <hr className="my-8 border-muted" />,
  table: ({ children, ...props }) => (
    <div className="my-8 -mx-4 md:-mx-16 lg:-mx-24 overflow-x-auto">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-muted px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-muted px-4 py-2" {...props}>
      {children}
    </td>
  ),
};
