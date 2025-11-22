import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";

interface LawHeaderProps {
  breadcrumb: string[];
  status: string;
  tags: string[];
  title: string;
  code: string;
  location: string;
  author: string;
}

export function LawHeader({
  breadcrumb,
  status,
  tags,
  title,
  code,
  location,
  author,
}: LawHeaderProps) {
  return (
    <Card className="px-5 py-4">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {breadcrumb.map((item, idx) => (
            <span key={item} className="flex items-center gap-2">
              <Link
                href={idx === 0 ? "/" : "/leis"}
                className="transition-colors duration-200 hover:text-foreground"
              >
                {item}
              </Link>
              {idx < breadcrumb.length - 1 ? (
                <span className="text-muted-foreground/60">&gt;</span>
              ) : null}
            </span>
          ))}
        </div>
      </nav>

      {/* Status & Tags */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <StatusBadge status={status} />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="transition-all duration-200 hover:scale-105"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {code} · {location} · {author}
        </p>
      </div>
    </Card>
  );
}
