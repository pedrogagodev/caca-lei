import { Button } from "@/components/ui/button";

interface ReactionButtonProps {
  label: string;
  active?: boolean;
}

export function ReactionButton({ label, active }: ReactionButtonProps) {
  return (
    <Button variant={active ? "default" : "outline"} className="w-full">
      {label}
    </Button>
  );
}
