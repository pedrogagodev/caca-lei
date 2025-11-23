import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VideoContainerProps {
  children: ReactNode;
  className?: string;
}

export function VideoContainer({ children, className }: VideoContainerProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        // Mobile: Full width
        "w-full",
        // Desktop: Constrained width for better viewing
        "lg:w-full lg:max-w-[600px] lg:mx-auto",
        className,
      )}
    >
      {/* Video + Overlay Container */}
      <div className="relative w-full">{children}</div>
    </div>
  );
}
