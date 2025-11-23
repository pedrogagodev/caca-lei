import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AuthorStatementProps {
  author: {
    name: string;
    role: string;
    party?: string;
    avatar?: string;
    statement: string;
  };
}

export function AuthorStatement({ author }: AuthorStatementProps) {
  // Get initials from name for avatar fallback
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card className="px-4 py-4 md:px-6 md:py-5">
      {/* Header */}
      <div className="mb-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          Mensagem do autor
        </p>
        <h2 className="text-xl font-semibold">Por que este projeto importa</h2>
      </div>

      {/* Author Info */}
      <div className="mb-4 flex items-start gap-4">
        <Avatar className="h-12 w-12 border-2 border-border transition-transform duration-200 hover:scale-105">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{author.name}</p>
          <p className="text-sm text-muted-foreground">{author.role}</p>
          {author.party && (
            <Badge variant="outline" className="mt-1.5 text-xs">
              {author.party}
            </Badge>
          )}
        </div>
      </div>

      {/* Statement */}
      <div className="prose prose-sm max-w-none text-muted-foreground md:prose-base">
        <p className="whitespace-pre-line leading-relaxed">
          {author.statement}
        </p>
      </div>
    </Card>
  );
}
