import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <Card className="px-4 py-4 md:px-6 md:py-5">
      {/* Header */}
      <div className="mb-5">
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          Perguntas frequentes
        </p>
        <h2 className="text-xl font-semibold">Dúvidas comuns</h2>
      </div>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
