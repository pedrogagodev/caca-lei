"use client";

import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DetailSection {
  title: string;
  content: string;
}

interface LawDetailsAccordionProps {
  sections: DetailSection[];
}

export function LawDetailsAccordion({ sections }: LawDetailsAccordionProps) {
  return (
    <Card className="px-4 py-4 md:px-5 md:py-5">
      <div className="mb-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          Detalhes
        </p>
        <h2 className="text-xl font-semibold">Mais informações</h2>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {sections.map((section, idx) => (
          <AccordionItem
            key={section.title}
            value={`item-${idx}`}
            className="rounded-xl border bg-muted/30 px-4 transition-all duration-200 hover:border-primary/40"
          >
            <AccordionTrigger className="text-sm font-semibold hover:no-underline md:text-base">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {section.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
