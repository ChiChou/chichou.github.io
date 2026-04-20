"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();

  function navClass(href: string) {
    const isActive =
      pathname === href ||
      pathname.startsWith(href + "/") ||
      (href === "/blog" && pathname.startsWith("/posts/"));
    return `relative py-1 transition-colors duration-200 outline-none ${
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;
  }

  function isActive(href: string) {
    return (
      pathname === href ||
      pathname.startsWith(href + "/") ||
      (href === "/blog" && pathname.startsWith("/posts/"))
    );
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
      <div className="relative flex items-center justify-center gap-8 px-4 pt-5 pb-4 lg:pt-8 lg:pb-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight leading-none bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #65b849 17%, #f7b423 17%, #f7b423 34%, #f58122 34%, #f58122 50%, #de3a3c 50%, #de3a3c 66%, #943f96 66%, #943f96 82%, #009fd9 82%, #009fd9 86%)",
          }}
        >
          CodeColorist
        </Link>
        {[
          { href: "/blog", label: "Blog" },
          { href: "/talks", label: "Talks" },
          { href: "/about", label: "About" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} className={navClass(href)}>
            {label}
            {isActive(href) && (
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-foreground" />
            )}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </header>
  );
}
