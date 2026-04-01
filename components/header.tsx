import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="py-5 border-b border-border/40">
      <div className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #65b849 17%, #f7b423 17%, #f7b423 34%, #f58122 34%, #f58122 50%, #de3a3c 50%, #de3a3c 66%, #943f96 66%, #943f96 82%, #009fd9 82%, #009fd9 86%)",
          }}
        >
          CodeColorist
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/talks"
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Talks
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              About
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
