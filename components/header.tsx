import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="py-8">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          CodeColorist
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
