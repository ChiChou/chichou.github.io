import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between container mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            CodeColorist
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/posts/page/1"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/talks"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Talks
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex sm:hidden items-center gap-4">
            <Link
              href="/posts/page/1"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Posts
            </Link>
            <Link
              href="/talks"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Talks
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
