import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage === 2 ? `${basePath}/` : `${basePath}/page/${currentPage - 1}`;
  const nextHref = `${basePath}/page/${currentPage + 1}`;

  return (
    <nav className="flex items-center justify-center gap-4 mt-12">
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 text-muted-foreground/50">
          <ChevronLeft size={20} />
          <span>Previous</span>
        </span>
      )}

      <span className="text-muted-foreground">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 text-muted-foreground/50">
          <span>Next</span>
          <ChevronRight size={20} />
        </span>
      )}
    </nav>
  );
}
