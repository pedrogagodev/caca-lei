"use client";

import { Button } from "@/components/ui/button";
import { ShareFat, FileText } from "@phosphor-icons/react";

export function QuickActions() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleViewText = () => {
    // TODO: Navigate to official text or open modal
    console.log("View official text clicked");
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Button
        onClick={handleViewText}
        className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <FileText className="mr-2 h-4 w-4" weight="duotone" />
        Ver texto oficial
      </Button>
      <Button
        variant="outline"
        onClick={handleShare}
        className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <ShareFat className="mr-2 h-4 w-4 transition-transform duration-200 hover:rotate-3" weight="duotone" />
        Compartilhar
      </Button>
    </div>
  );
}
