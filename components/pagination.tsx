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
    <nav className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          transitionTypes={['slide-back']}
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 text-muted-foreground/30">
          <ChevronLeft size={18} />
          <span>Previous</span>
        </span>
      )}

      <span className="text-sm text-muted-foreground tabular-nums px-2">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          transitionTypes={['slide-forward']}
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 text-muted-foreground/30">
          <span>Next</span>
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
