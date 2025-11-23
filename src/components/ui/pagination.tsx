"use client";

import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        aria-label="Previous page"
        className="gap-1 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
      >
        <CaretLeft size={16} weight="bold" />
        <span>Anterior</span>
      </Button>

      <div className="flex items-center gap-2 px-3">
        <span className="text-sm font-medium tabular-nums">
          Página {currentPage}
        </span>
        {totalPages > 1 && (
          <>
            <span className="text-sm text-muted-foreground">de</span>
            <span className="text-sm font-medium tabular-nums">
              {totalPages}
            </span>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Next page"
        className="gap-1 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
      >
        <span>Próxima</span>
        <CaretRight size={16} weight="bold" />
      </Button>
    </nav>
  );
}
