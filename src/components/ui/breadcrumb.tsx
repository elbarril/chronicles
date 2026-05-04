import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps): JSX.Element | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Migas de pan" className={cn("text-sm", className)}>
      <ol className="text-muted-foreground flex flex-wrap items-center gap-x-1 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = `${item.label}-${index}`;

          return (
            <li key={key} className="flex min-w-0 items-center gap-x-1">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-foreground truncate transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn("truncate", isLast && "text-foreground font-medium")}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
